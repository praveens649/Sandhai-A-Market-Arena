const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All order operations require authentication
router.use(authMiddleware);

router.post("/", (req, res) => orderController.placeOrder(req, res));
router.get("/my-orders", (req, res) => orderController.getMyOrders(req, res));
router.get("/:id", (req, res) => orderController.getOrderById(req, res));
router.patch("/:id/cancel", (req, res) => orderController.cancelOrder(req, res));

module.exports = router;

