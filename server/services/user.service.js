const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { generateToken } = require("../jwt/token.service");

class UserService {
  async signup({ name, email, password, phone }) {
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === "superadmin@example.com") {
      throw new Error("This email is reserved for system administration");
    }
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new Error("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Rule: Public signup is strictly for 'user' role
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      role: "user",
      isActive: true,
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account has been deactivated. Please contact support.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateProfile(userId, { name, phone }) {
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

module.exports = new UserService();

