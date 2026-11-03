const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/role.middleware");

// Public browsing routes
router.get("/", (req, res) => productController.getAll(req, res));
router.get("/category/:categoryId", (req, res) => productController.getByCategory(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));

// Admin-only management routes
router.post("/", authMiddleware, adminOnly, (req, res) => productController.create(req, res));
router.put("/:id", authMiddleware, adminOnly, (req, res) => productController.update(req, res));
router.delete("/:id", authMiddleware, adminOnly, (req, res) => productController.delete(req, res));

module.exports = router;

