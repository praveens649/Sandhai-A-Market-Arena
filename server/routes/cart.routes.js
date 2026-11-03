const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All cart operations require authentication
router.use(authMiddleware);

router.get("/", (req, res) => cartController.getCart(req, res));
router.post("/items", (req, res) => cartController.addItem(req, res));
router.patch("/items/:productId", (req, res) => cartController.updateQuantity(req, res));
router.delete("/items/:productId", (req, res) => cartController.removeItem(req, res));
router.delete("/", (req, res) => cartController.clearCart(req, res));

module.exports = router;

