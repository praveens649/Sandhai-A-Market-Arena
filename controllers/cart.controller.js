const cartService = require("../services/cart.service");

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      return res.status(200).json({
        success: true,
        cart,
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
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      const cart = await cartService.addToCart(req.user.id, productId, quantity || 1);
      return res.status(200).json({
        success: true,
        message: "Item added to cart",
        cart,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: "Quantity is required",
        });
      }

      const cart = await cartService.updateCartItemQuantity(req.user.id, productId, quantity);
      return res.status(200).json({
        success: true,
        message: "Cart updated",
        cart,
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
      const cart = await cartService.removeFromCart(req.user.id, productId);
      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async clearCart(req, res) {
    try {
      const result = await cartService.clearCart(req.user.id);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CartController();

