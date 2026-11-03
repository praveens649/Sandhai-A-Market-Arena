const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price unit image stock isActive",
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Filter out items where product may have been permanently removed
    const validItems = cart.items.filter((item) => item.product !== null);

    // Calculate subtotal
    const subtotal = validItems.reduce((acc, item) => {
      return acc + (item.product.price || 0) * item.quantity;
    }, 0);

    return {
      _id: cart._id,
      user: cart.user,
      items: validItems,
      subtotal,
      totalItems: validItems.reduce((acc, item) => acc + item.quantity, 0),
    };
  }

  async addToCart(userId, productId, quantity = 1) {
    const qty = Number(quantity);
    if (qty <= 0) {
      throw new Error("Quantity must be at least 1");
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new Error("Product is not available");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (newQty > product.stock) {
        throw new Error(
          `Cannot add more. Available stock is only ${product.stock}`
        );
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      if (qty > product.stock) {
        throw new Error(
          `Cannot add ${qty}. Available stock is only ${product.stock}`
        );
      }
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateCartItemQuantity(userId, productId, quantity) {
    const qty = Number(quantity);
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    if (qty <= 0) {
      // Remove item if quantity set to 0 or less
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        throw new Error("Product is no longer available");
      }
      if (qty > product.stock) {
        throw new Error(`Available stock is only ${product.stock}`);
      }

      const item = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (!item) {
        throw new Error("Product not in cart");
      }
      item.quantity = qty;
    }

    await cart.save();
    return this.getCart(userId);
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return { message: "Cart cleared successfully" };
  }
}

module.exports = new CartService();

