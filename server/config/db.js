require("dotenv").config();
const mongoose = require("mongoose");
const seedAdminAndDefaults = require("./seed");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    // Automatically seed admin and default categories
    await seedAdminAndDefaults();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
