const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/role.middleware");

// Public routes
router.get("/", (req, res) => categoryController.getAll(req, res));
router.get("/:id", (req, res) => categoryController.getById(req, res));

// Admin-only management routes
router.post("/", authMiddleware, adminOnly, (req, res) => categoryController.create(req, res));
router.put("/:id", authMiddleware, adminOnly, (req, res) => categoryController.update(req, res));
router.delete("/:id", authMiddleware, adminOnly, (req, res) => categoryController.delete(req, res));

module.exports = router;

