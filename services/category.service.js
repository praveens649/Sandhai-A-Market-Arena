const Category = require("../models/category.model");
const Product = require("../models/product.model");

class CategoryService {
  async getAllCategories(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return Category.find(filter).sort({ name: 1 });
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async createCategory({ name, description, image }) {
    if (!name) {
      throw new Error("Category name is required");
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });
    if (existing) {
      throw new Error("Category with this name already exists");
    }

    return Category.create({
      name: trimmedName,
      description: description ? description.trim() : "",
      image: image || "",
      isActive: true,
    });
  }

  async updateCategory(id, updateData) {
    if (updateData.name) {
      updateData.name = updateData.name.trim();
      const existing = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${updateData.name}$`, "i") },
      });
      if (existing) {
        throw new Error("Category with this name already exists");
      }
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async deleteCategory(id) {
    // Check if products exist under this category
    const linkedProductsCount = await Product.countDocuments({
      category: id,
      isActive: true,
    });

    if (linkedProductsCount > 0) {
      throw new Error(
        `Cannot delete category. There are ${linkedProductsCount} active product(s) in this category.`
      );
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Category not found");
    }

    return { message: "Category deleted successfully", id };
  }
}

module.exports = new CategoryService();

