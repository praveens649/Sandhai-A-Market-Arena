const userService = require("../services/user.service");

class UserController {
  async signup(req, res) {
    try {
      const { name, email, password, phone } = req.body;
      const result = await userService.signup({ name, email, password, phone });
      return res.status(201).json({
        success: true,
        message: "Customer account created successfully",
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      const status = error.message.includes("deactivated") ? 403 : 401;
      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
