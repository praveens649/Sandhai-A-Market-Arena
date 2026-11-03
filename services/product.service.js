const Product = require("../models/product.model");
const Category = require("../models/category.model");

class ProductService {
  async getAllProducts(query = {}) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 20,
      includeInactive = false,
    } = query;

    const filter = {};

    if (!includeInactive) {
      filter.isActive = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "name-asc") sortOption = { name: 1 };
    else if (sort === "name-desc") sortOption = { name: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    };
  }

  async getProductById(id) {
    const product = await Product.findById(id).populate("category", "name");
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async getProductsByCategory(categoryId) {
    return Product.find({ category: categoryId, isActive: true })
      .populate("category", "name")
      .sort({ createdAt: -1 });
  }

  async createProduct({
    name,
    description,
    category,
    price,
    unit = "kg",
    image = "",
    stock = 0,
  }) {
    if (!name || !category || price === undefined) {
      throw new Error("Product name, category, and price are required");
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new Error("Invalid category: Category does not exist");
    }

    return Product.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      category,
      price: Number(price),
      unit: unit.trim(),
      image,
      stock: Number(stock),
      isActive: true,
    });
  }

  async updateProduct(id, updateData) {
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        throw new Error("Invalid category: Category does not exist");
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name");

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async deleteProduct(id) {
    // Soft delete / deactivate product so order history integrity remains intact
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return { message: "Product deactivated successfully", id };
  }
}

module.exports = new ProductService();

