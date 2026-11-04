const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Address = require("../models/address.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

const seedAdminAndDefaults = async () => {
  try {
    // ──────────────────────────────────────────
    // 1. Seed or Update Super Admin
    // ──────────────────────────────────────────
    const adminEmail = "superadmin@example.com";
    const hashedAdminPassword = await bcrypt.hash("12345678910", 10);

    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Super Admin",
        email: adminEmail,
        password: hashedAdminPassword,
        phone: "9876543210",
        role: "admin",
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[SEED] Super admin verified: ${adminUser.email} (Role: ${adminUser.role})`);

    // ──────────────────────────────────────────
    // 2. Seed Demo Customers
    // ──────────────────────────────────────────
    const demoPassword = await bcrypt.hash("password123", 10);

    const customer1 = await User.findOneAndUpdate(
      { email: "customer@example.com" },
      {
        name: "Ramesh Kumar",
        email: "customer@example.com",
        password: demoPassword,
        phone: "9876543211",
        role: "user",
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const customer2 = await User.findOneAndUpdate(
      { email: "priya@example.com" },
      {
        name: "Priya Sundaram",
        email: "priya@example.com",
        password: demoPassword,
        phone: "9876543222",
        role: "user",
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[SEED] Demo customers verified: ${customer1.email}, ${customer2.email}`);

    // ──────────────────────────────────────────
    // 3. Seed Default Grocery Categories
    // ──────────────────────────────────────────
    const defaultCategories = [
      {
        name: "Fruits",
        description: "Fresh, juicy, and seasonal farm fruits directly from orchards",
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Vegetables",
        description: "Organic, leafy greens, native herbs, and healthy farm vegetables",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Dairy Products",
        description: "Pure cow milk, artisan butter, thick curd, and fresh cottage paneer",
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Grocery & Staples",
        description: "Aged basmati rice, organic pulses, cold-pressed oils, and kitchen essentials",
        image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Snacks & Beverages",
        description: "Traditional filter coffee blend, dry fruits, roasted nuts, and savories",
        image: "https://images.unsplash.com/photo-1509912760195-55ff1b56360c?auto=format&fit=crop&w=600&q=80",
      },
    ];

    const categoryMap = {};
    for (const cat of defaultCategories) {
      let savedCat = await Category.findOne({ name: cat.name });
      if (!savedCat) {
        savedCat = await Category.create(cat);
        console.log(`[SEED] Category created: ${cat.name}`);
      }
      categoryMap[cat.name] = savedCat._id;
    }

    // ──────────────────────────────────────────
    // 4. Seed Products (Rich Sandhai Catalog)
    // ──────────────────────────────────────────
    const catalogProducts = [
      // ── Fruits ──
      {
        name: "Shimla Royal Apples",
        category: categoryMap["Fruits"],
        price: 180,
        unit: "kg",
        stock: 45,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
        description: "Crisp, sweet, and handpicked red royal apples from Himachal orchards.",
      },
      {
        name: "Nagpur Sweet Oranges",
        category: categoryMap["Fruits"],
        price: 90,
        unit: "kg",
        stock: 35,
        image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80",
        description: "Juicy citrus oranges rich in natural Vitamin C, perfect for fresh morning juice.",
      },
      {
        name: "Robusta Yellow Bananas",
        category: categoryMap["Fruits"],
        price: 50,
        unit: "kg",
        stock: 60,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
        description: "Naturally ripened, fiber-packed sweet yellow bananas.",
      },
      {
        name: "Alphonso Mangoes (Ratnagiri)",
        category: categoryMap["Fruits"],
        price: 380,
        unit: "kg",
        stock: 8, // Low stock triggers 'Only N left' badge
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
        description: "King of mangoes with rich aroma, golden tender pulp, and natural sweetness.",
      },
      {
        name: "Kashmiri Pomegranate",
        category: categoryMap["Fruits"],
        price: 210,
        unit: "kg",
        stock: 25,
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
        description: "Ruby red sweet arils loaded with antioxidants, folate, and vital nutrients.",
      },

      // ── Vegetables ──
      {
        name: "Country Fresh Red Tomatoes",
        category: categoryMap["Vegetables"],
        price: 40,
        unit: "kg",
        stock: 75,
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
        description: "Firm, tangy red tomatoes locally harvested for curries and salads.",
      },
      {
        name: "Organic Native Palak (Spinach)",
        category: categoryMap["Vegetables"],
        price: 30,
        unit: "bunch",
        stock: 6, // Low stock triggers 'Only N left' badge
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
        description: "Tender, iron-rich green spinach leaves harvested daily at morning dawn.",
      },
      {
        name: "Ooty Sweet Baby Carrots",
        category: categoryMap["Vegetables"],
        price: 65,
        unit: "kg",
        stock: 40,
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
        description: "Sweet, crunchy hill-grown carrots packed with beta carotene.",
      },
      {
        name: "Organic Baby Potatoes",
        category: categoryMap["Vegetables"],
        price: 45,
        unit: "kg",
        stock: 90,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
        description: "Fresh earthen baby potatoes ideal for roasting and traditional gravies.",
      },
      {
        name: "Green Bell Pepper (Capsicum)",
        category: categoryMap["Vegetables"],
        price: 70,
        unit: "kg",
        stock: 22,
        image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
        description: "Crisp bell peppers adding vibrant crunch, aroma, and essential vitamins.",
      },

      // ── Dairy Products ──
      {
        name: "Fresh Farm Cow Milk (A2)",
        category: categoryMap["Dairy Products"],
        price: 35,
        unit: "litre",
        stock: 50,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
        description: "Pure, chilled, pasteurized farm cow milk with natural whole cream.",
      },
      {
        name: "Malai Paneer (Cottage Cheese)",
        category: categoryMap["Dairy Products"],
        price: 120,
        unit: "pack",
        stock: 7, // Low stock triggers 'Only N left' badge
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
        description: "Soft, melt-in-mouth cottage cheese crafted from whole cow milk (200g).",
      },
      {
        name: "Pure Cow Desi Ghee",
        category: categoryMap["Dairy Products"],
        price: 420,
        unit: "pack",
        stock: 18,
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
        description: "Aromatic bilona-churned golden cow ghee for authentic aroma and flavor (500ml).",
      },
      {
        name: "Thick Homestyle Set Curd (Dahi)",
        category: categoryMap["Dairy Products"],
        price: 40,
        unit: "pack",
        stock: 30,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
        description: "Thick, probiotic-rich set curd with traditional natural tang (400g).",
      },

      // ── Grocery & Staples ──
      {
        name: "Premium Aged Basmati Rice",
        category: categoryMap["Grocery & Staples"],
        price: 160,
        unit: "kg",
        stock: 40,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        description: "Extra long grain royal basmati rice aged to perfection for biryanis and pulao.",
      },
      {
        name: "Organic Native Toor Dal",
        category: categoryMap["Grocery & Staples"],
        price: 140,
        unit: "kg",
        stock: 50,
        image: "https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=600&q=80",
        description: "Unpolished, protein-dense native toor dal for aromatic sambar and dal fry.",
      },
      {
        name: "Cold-Pressed Sesame (Gingelly) Oil",
        category: categoryMap["Grocery & Staples"],
        price: 290,
        unit: "litre",
        stock: 20,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
        description: "Traditional chekku-pressed pure sesame oil with rich nutty aroma (1L).",
      },
      {
        name: "Whole Wheat Stone-Ground Atta",
        category: categoryMap["Grocery & Staples"],
        price: 60,
        unit: "kg",
        stock: 80,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
        description: "100% stone-ground whole wheat flour for soft, fluffy rotis and chapatis.",
      },

      // ── Snacks & Beverages ──
      {
        name: "Jumbo Roasted & Salted Cashews",
        category: categoryMap["Snacks & Beverages"],
        price: 240,
        unit: "pack",
        stock: 15,
        image: "https://images.unsplash.com/photo-1509912760195-55ff1b56360c?auto=format&fit=crop&w=600&q=80",
        description: "Lightly salted, premium Mangalorean cashews slow-roasted to golden crisp (200g).",
      },
      {
        name: "Madras Filter Coffee Chicory Blend",
        category: categoryMap["Snacks & Beverages"],
        price: 110,
        unit: "pack",
        stock: 25,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        description: "Traditional 80:20 plantation chicory blend for strong, frothy South Indian filter coffee (200g).",
      },
    ];

    // Remove legacy duplicates of "Shimla Fresh Apples" from older test runs
    await Product.deleteMany({ name: "Shimla Fresh Apples" });

    const seededProducts = [];
    for (const prod of catalogProducts) {
      const existing = await Product.findOneAndUpdate(
        { name: prod.name },
        prod,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      seededProducts.push(existing);
    }
    console.log(`[SEED] Product catalog seeded: ${seededProducts.length} items across 5 categories.`);

    // ──────────────────────────────────────────
    // 5. Seed Delivery Addresses for Demo Customers
    // ──────────────────────────────────────────
    const address1 = await Address.findOneAndUpdate(
      { user: customer1._id, recipientName: "Ramesh Kumar" },
      {
        user: customer1._id,
        recipientName: "Ramesh Kumar",
        phone: "9876543211",
        addressLine: "Plot 14, 2nd Cross Street, Anna Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        postalCode: "600040",
        isDefault: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const address2 = await Address.findOneAndUpdate(
      { user: customer2._id, recipientName: "Priya Sundaram" },
      {
        user: customer2._id,
        recipientName: "Priya Sundaram",
        phone: "9876543222",
        addressLine: "Flat 4B, Emerald Heights, Gandhipuram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        postalCode: "641012",
        isDefault: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[SEED] Default delivery addresses seeded for demo customers.`);

    // ──────────────────────────────────────────
    // 6. Seed Realistic Orders (Ordered, Delivered, Cancelled)
    // ──────────────────────────────────────────
    const existingOrdersCount = await Order.countDocuments();
    if (existingOrdersCount < 5) {
      const sampleOrders = [
        {
          user: customer1._id,
          deliveryAddress: {
            recipientName: address1.recipientName,
            phone: address1.phone,
            addressLine: address1.addressLine,
            city: address1.city,
            state: address1.state,
            postalCode: address1.postalCode,
          },
          items: [
            {
              productId: seededProducts[0]._id,
              name: seededProducts[0].name,
              price: seededProducts[0].price,
              quantity: 2,
              unit: seededProducts[0].unit,
              image: seededProducts[0].image,
            },
            {
              productId: seededProducts[5]._id,
              name: seededProducts[5].name,
              price: seededProducts[5].price,
              quantity: 2,
              unit: seededProducts[5].unit,
              image: seededProducts[5].image,
            },
          ],
          itemsTotal: 440,
          deliveryCharge: 40,
          totalAmount: 480,
          paymentMethod: "COD",
          paymentStatus: "Pending",
          orderStatus: "Ordered",
          createdAt: new Date(),
        },
        {
          user: customer2._id,
          deliveryAddress: {
            recipientName: address2.recipientName,
            phone: address2.phone,
            addressLine: address2.addressLine,
            city: address2.city,
            state: address2.state,
            postalCode: address2.postalCode,
          },
          items: [
            {
              productId: seededProducts[10]._id,
              name: seededProducts[10].name,
              price: seededProducts[10].price,
              quantity: 3,
              unit: seededProducts[10].unit,
              image: seededProducts[10].image,
            },
            {
              productId: seededProducts[12]._id,
              name: seededProducts[12].name,
              price: seededProducts[12].price,
              quantity: 1,
              unit: seededProducts[12].unit,
              image: seededProducts[12].image,
            },
          ],
          itemsTotal: 525,
          deliveryCharge: 0,
          totalAmount: 525,
          paymentMethod: "UPI",
          paymentStatus: "Completed",
          orderStatus: "Delivered",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          user: customer1._id,
          deliveryAddress: {
            recipientName: address1.recipientName,
            phone: address1.phone,
            addressLine: address1.addressLine,
            city: address1.city,
            state: address1.state,
            postalCode: address1.postalCode,
          },
          items: [
            {
              productId: seededProducts[14]._id,
              name: seededProducts[14].name,
              price: seededProducts[14].price,
              quantity: 2,
              unit: seededProducts[14].unit,
              image: seededProducts[14].image,
            },
          ],
          itemsTotal: 320,
          deliveryCharge: 40,
          totalAmount: 360,
          paymentMethod: "COD",
          paymentStatus: "Pending",
          orderStatus: "Cancelled",
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
      ];

      for (const ord of sampleOrders) {
        await Order.create(ord);
      }
      console.log(`[SEED] Sample realistic customer orders created.`);
    }

    // ──────────────────────────────────────────
    // 7. Migrate any legacy order statuses
    // ──────────────────────────────────────────
    const migrationResult = await Order.updateMany(
      { orderStatus: { $in: ["Pending", "Processing", "Shipped"] } },
      { $set: { orderStatus: "Ordered" } }
    );
    if (migrationResult.modifiedCount > 0) {
      console.log(`[MIGRATION] Migrated ${migrationResult.modifiedCount} legacy order(s) to 'Ordered'`);
    }

    // ──────────────────────────────────────────
    // 8. Auto-heal carts by removing orphaned/deleted products
    // ──────────────────────────────────────────
    const allCarts = await Cart.find();
    for (const c of allCarts) {
      if (c.items && c.items.length > 0) {
        const cleanedItems = [];
        for (const item of c.items) {
          const exists = await Product.exists({ _id: item.product, isActive: true });
          if (exists) {
            cleanedItems.push(item);
          }
        }
        if (cleanedItems.length !== c.items.length) {
          c.items = cleanedItems;
          await c.save();
        }
      }
    }

    console.log(`[SEED] Sandhai database seeding completed successfully.`);
  } catch (error) {
    console.error("[SEED] Error seeding database:", error.message);
  }
};

module.exports = seedAdminAndDefaults;
