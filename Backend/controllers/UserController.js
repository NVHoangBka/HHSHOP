const User = require("../models/User");

class UserController {
  // === LẤY TẤT CẢ USER  ===
  static async getUsersAll(req, res) {
    try {
      const { email, phoneNumber } = req.query;

      const query = {};
      if (email) query.email = email; // chỉ thêm nếu có giá trị truthy
      if (phoneNumber) query.phoneNumber = phoneNumber;

      const user = await User.findOne(query);

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Không tìm thấy thông tin khách hàng với email hoặc số điện thoại này",
        });
      }

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
    } catch (error) {
      console.error("Lỗi getUsersAll:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống, vui lòng thử lại sau",
      });
    }
  }
}

module.exports = UserController;
