const Address = require("../models/address.model");

class AddressService {
  async getAddresses(userId) {
    return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  }

  async addAddress(userId, data) {
    const { recipientName, phone, addressLine, city, state, postalCode, isDefault } = data;

    if (!recipientName || !phone || !addressLine || !city || !state || !postalCode) {
      throw new Error("All address fields are required");
    }

    // If marked default, unset existing default
    if (isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    } else {
      // If user has no existing addresses, make this first one default
      const count = await Address.countDocuments({ user: userId });
      if (count === 0) {
        data.isDefault = true;
      }
    }

    return Address.create({
      user: userId,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      isDefault: Boolean(data.isDefault),
    });
  }

  async updateAddress(userId, addressId, data) {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      throw new Error("Address not found or unauthorized");
    }

    if (data.isDefault) {
      await Address.updateMany({ user: userId, _id: { $ne: addressId } }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      data,
      { new: true, runValidators: true }
    );

    return updated;
  }

  async deleteAddress(userId, addressId) {
    const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
    if (!address) {
      throw new Error("Address not found or unauthorized");
    }
    return { message: "Address deleted successfully", id: addressId };
  }
}

module.exports = new AddressService();

