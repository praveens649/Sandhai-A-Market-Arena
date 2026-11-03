const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/role.middleware");

// Public admin login
router.post("/login", (req, res) => adminController.login(req, res));

// Protected admin routes
router.use(authMiddleware, adminOnly);

router.get("/dashboard", (req, res) => adminController.getDashboard(req, res));
router.get("/users", (req, res) => adminController.getUsers(req, res));
router.patch("/users/:id/status", (req, res) => adminController.updateUserStatus(req, res));
router.get("/orders", (req, res) => adminController.getOrders(req, res));
router.patch("/orders/:id/status", (req, res) => adminController.updateOrderStatus(req, res));

module.exports = router;

