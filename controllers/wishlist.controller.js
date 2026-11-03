const wishlistService = require("../services/wishlist.service");

class WishlistController {
  async getWishlist(req, res) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user.id);
      return res.status(200).json({
        success: true,
        wishlist,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addItem(req, res) {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      const wishlist = await wishlistService.addToWishlist(req.user.id, productId);
      return res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        wishlist,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removeItem(req, res) {
    try {
      const { productId } = req.params;
      const wishlist = await wishlistService.removeFromWishlist(req.user.id, productId);
      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        wishlist,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new WishlistController();

