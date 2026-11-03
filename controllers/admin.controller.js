const adminService = require("../services/admin.service");

class AdminController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      return res.status(200).json({
        success: true,
        message: "Admin authentication successful",
        ...result,
      });
    } catch (error) {
      const status = error.message.includes("denied") || error.message.includes("deactivated") ? 403 : 401;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getDashboard(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      return res.status(200).json({
        success: true,
        dashboard: stats,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await adminService.getAllUsers();
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await adminService.updateUserStatus(id, isActive);
      return res.status(200).json({
        success: true,
        message: `User status changed to ${isActive ? "active" : "inactive"}`,
        user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await adminService.getAllOrders();
      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;
      const order = await adminService.updateOrderStatus(id, orderStatus);
      return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AdminController();

