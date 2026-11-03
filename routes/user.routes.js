const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Public routes
router.post("/signup", (req, res) => userController.signup(req, res));
router.post("/login", (req, res) => userController.login(req, res));

// Authenticated user routes
router.get("/profile", authMiddleware, (req, res) => userController.getProfile(req, res));
router.put("/profile", authMiddleware, (req, res) => userController.updateProfile(req, res));

module.exports = router;
