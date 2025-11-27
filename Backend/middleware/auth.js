const jwt = require("jsonwebtoken");
const User = require("../models/User"); // BẮT BUỘC

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có token, vui lòng đăng nhập lại",
      expired: true,
    });
  }

  try {
    // 2. XÁC MINH TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ĐẢM BẢO LẤY ĐÚNG ID DÙ SIGN BẰNG id HAY _id
    const userId = decoded.id || decoded._id;
    if (!userId) throw new Error("Token không hợp lệ");

    // 3. LẤY USER TỪ DB (BẢO MẬT)
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Người dùng không tồn tại",
        expired: true,
      });
    }

    // 4. GẮN USER ĐẦY ĐỦ VÀO req
    req.user = user;
    next();
  } catch (error) {
    console.error("Token error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
      expired: true,
    });
  }
};

// XUẤT THEO TÊN
module.exports = { protect };
