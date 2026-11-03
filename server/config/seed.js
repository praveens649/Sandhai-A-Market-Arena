const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Category = require("../models/category.model");

const seedAdminAndDefaults = async () => {
  try {
    // 1. Seed Super Admin
    const adminEmail = "superadmin@example.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("12345678910", 10);
      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        phone: "9876543210",
        role: "admin",
        isActive: true,
      });
      console.log(`[SEED] Super admin created: ${adminEmail}`);
    } else {
      // Ensure admin role and active status
      if (existingAdmin.role !== "admin" || !existingAdmin.isActive) {
        existingAdmin.role = "admin";
        existingAdmin.isActive = true;
        await existingAdmin.save();
      }
    }

    // 2. Seed Default Grocery Categories if none exist
    const defaultCategories = [
      {
        name: "Fruits",
        description: "Fresh, juicy, and seasonal farm fruits",
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Vegetables",
        description: "Organic, leafy greens and healthy farm vegetables",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Dairy Products",
        description: "Pure milk, artisan cheese, butter, yogurt and paneer",
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Grocery & Staples",
        description: "Rice, wheat flour, pulses, spices and cooking essentials",
        image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=600&q=80",
      },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`[SEED] Default category created: ${cat.name}`);
      }
    }
  } catch (error) {
    console.error("[SEED] Error seeding database:", error.message);
  }
};

module.exports = seedAdminAndDefaults;

