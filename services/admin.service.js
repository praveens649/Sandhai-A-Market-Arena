const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { generateToken } = require("../jwt/token.service");

class AdminService {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await User.findOne({ email: normalizedEmail });
    if (!admin) {
      throw new Error("Invalid admin credentials");
    }

    if (admin.role !== "admin") {
      throw new Error("Access denied: Not authorized as administrator");
    }

    if (!admin.isActive) {
      throw new Error("Admin account is deactivated");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Invalid admin credentials");
    }

    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    const adminObj = admin.toObject();
    delete adminObj.password;

    return { admin: adminObj, token };
  }

  async getDashboardStats() {
    const [totalProducts, totalUsers, totalOrders, salesAgg, recentOrders] =
      await Promise.all([
        Product.countDocuments({ isActive: true }),
        User.countDocuments({ role: "user" }),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { orderStatus: { $ne: "Cancelled" } } },
          { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
        ]),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("user", "name email phone"),
      ]);

    const totalSales = salesAgg.length > 0 ? salesAgg[0].totalSales : 0;

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalSales,
      recentOrders,
    };
  }

  async getAllUsers() {
    return User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
  }

  async updateUserStatus(userId, isActive) {
    const user = await User.findOneAndUpdate(
      { _id: userId, role: "user" },
      { isActive: Boolean(isActive) },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new Error("User not found or cannot modify admin status");
    }

    return user;
  }

  async getAllOrders() {
    return Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
  }

  async updateOrderStatus(orderId, orderStatus) {
    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(orderStatus)) {
      throw new Error(`Invalid status. Allowed statuses: ${allowedStatuses.join(", ")}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // If changing to Cancelled and was not cancelled before, restore stock
    if (orderStatus === "Cancelled" && order.orderStatus !== "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = orderStatus;
    if (orderStatus === "Delivered") {
      order.paymentStatus = "Completed";
    }
    await order.save();

    return order;
  }
}

module.exports = new AdminService();

