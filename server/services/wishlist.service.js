const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "products",
      select: "name price unit image stock isActive category",
      populate: { path: "category", select: "name" },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    // Filter out null products if any were deleted from database
    wishlist.products = wishlist.products.filter((p) => p !== null);

    return wishlist;
  }

  async addToWishlist(userId, productId) {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new Error("Product not found or unavailable");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const alreadyExists = wishlist.products.some(
      (p) => p.toString() === productId
    );

    if (!alreadyExists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId, productId) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();

    return this.getWishlist(userId);
  }
}

module.exports = new WishlistService();

