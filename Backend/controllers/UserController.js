const User = require("../models/User");

class UserController {
  // === LẤY TẤT CẢ USER  ===
  static async getUsersAll(req, res) {
    console.log(req.body);
    console.log(req.params);
    try {
      const { email, phoneNumber } = req.body;
      const user = await User.findOne({
        email: email || "",
        phoneNumber: phoneNumber || "",
      });
      res.json({
        success: true,
        user: {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
      });
    } catch (error) {}
  }
}

module.exports = UserController;
