const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Address = require("../models/address.model");

class OrderService {
  async createOrder(userId, { addressId, paymentMethod = "COD" }) {
    if (!addressId) {
      throw new Error("Delivery address is required");
    }

    // 1. Fetch delivery address
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      throw new Error("Invalid delivery address selected");
    }

    // 2. Fetch cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty. Please add items before placing an order.");
    }

    // 3. Auto-heal: Filter out deleted/orphan products from cart
    const initialItemCount = cart.items.length;
    const validatedCartEntries = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product && product.isActive) {
        validatedCartEntries.push({ item, product });
      }
    }

    // If any orphan or inactive products were found, update the cart in database
    if (validatedCartEntries.length !== initialItemCount) {
      cart.items = validatedCartEntries.map((e) => e.item);
      await cart.save();
    }

    if (validatedCartEntries.length === 0) {
      throw new Error("The items in your cart are no longer available. Please select available products from the store.");
    }

    // 4. Server-side validation of stock and line totals
    const orderItems = [];
    let itemsTotal = 0;

    for (const { item, product } of validatedCartEntries) {
      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, in cart: ${item.quantity}`
        );
      }

      const itemSubtotal = product.price * item.quantity;
      itemsTotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit || "kg",
        image: product.image || "",
      });
    }

    // 4. Calculate delivery charge and final total
    const deliveryCharge = itemsTotal >= 500 ? 0 : 40;
    const totalAmount = itemsTotal + deliveryCharge;

    // 5. Deduct product stock safely
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 6. Create order snapshot
    const allowedPaymentMethods = ["COD", "Online", "Card", "UPI", "NetBanking"];
    const validPaymentMethod = allowedPaymentMethods.includes(paymentMethod)
      ? paymentMethod
      : "COD";

    const order = await Order.create({
      user: userId,
      items: orderItems,
      deliveryAddress: {
        recipientName: address.recipientName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
      },
      itemsTotal,
      deliveryCharge,
      totalAmount,
      paymentMethod: validPaymentMethod,
      paymentStatus: validPaymentMethod === "COD" ? "Pending" : "Completed",
      orderStatus: "Ordered",
    });

    // 7. Clear user's cart
    cart.items = [];
    await cart.save();

    return order;
  }

  async getMyOrders(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId, currentUser) {
    const order = await Order.findById(orderId).populate("user", "name email phone");
    if (!order) {
      throw new Error("Order not found");
    }

    if (
      currentUser.role !== "admin" &&
      order.user._id.toString() !== currentUser.id
    ) {
      throw new Error("Access denied: You are not authorized to view this order");
    }

    return order;
  }

  async cancelOrder(orderId, currentUser) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (
      currentUser.role !== "admin" &&
      order.user.toString() !== currentUser.id
    ) {
      throw new Error("Access denied: You can only cancel your own orders");
    }

    if (["Delivered", "Cancelled"].includes(order.orderStatus)) {
      throw new Error(
        `Cannot cancel order with current status '${order.orderStatus}'`
      );
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    return order;
  }
}

module.exports = new OrderService();

