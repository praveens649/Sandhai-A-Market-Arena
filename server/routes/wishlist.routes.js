const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All wishlist operations require authentication
router.use(authMiddleware);

router.get("/", (req, res) => wishlistController.getWishlist(req, res));
router.post("/items", (req, res) => wishlistController.addItem(req, res));
router.delete("/items/:productId", (req, res) => wishlistController.removeItem(req, res));

module.exports = router;

