const addressService = require("../services/address.service");

class AddressController {
  async getAll(req, res) {
    try {
      const addresses = await addressService.getAddresses(req.user.id);
      return res.status(200).json({
        success: true,
        addresses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const address = await addressService.addAddress(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        message: "Address added successfully",
        address,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Address updated successfully",
        address,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await addressService.deleteAddress(req.user.id, req.params.id);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AddressController();

