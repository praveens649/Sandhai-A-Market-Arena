const orderService = require("../services/order.service");

class OrderController {
  async placeOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await orderService.getMyOrders(req.user.id);
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

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      const status = error.message.includes("Access denied") ? 403 : 404;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cancelOrder(req, res) {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user);
      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order,
      });
    } catch (error) {
      const status = error.message.includes("Access denied") ? 403 : 400;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new OrderController();

