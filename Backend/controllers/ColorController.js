// backend/controllers/CartController.js
const Color = require("../models/Color.js");

class ColorController {
  /**
   * LẤY TOÀN BỘ MÀU (active)
   * GET /colors
   */
  static async getColos(req, res) {
    try {
      const categories = await Color.find({ isActive: true })
        .select("name value slug description")
        .sort({ "name.vi": 1 })
        .lean();

      res.json({
        success: true,
        colors: colors || [],
      });
    } catch (error) {
      console.error("Lỗi getColors:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh sách màu",
        error: error.message,
      });
    }
  }

  /**
   * LẤY MỘT MÀU THEO ID
   * GET /colors/:id
   */
  static async getColorById(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID màu không hợp lệ",
        });
      }

      const color = await Color.findById(id).lean();
      if (!color) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy màu",
        });
      }

      res.json({ success: true, color });
    } catch (error) {
      console.error("Lỗi getColorById:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
        error: error.message,
      });
    }
  }

  /**
   * TẠO MÀU MỚI
   * POST /colors
   */
  static async createColor(req, res) {
    try {
      const colorData = req.body;
      const newColor = await Color.create(colorData);

      res.status(201).json({
        success: true,
        message: "Tạo màu thành công",
        color: newColor,
      });
    } catch (error) {
      console.error("Lỗi createColor:", error);
      res.status(400).json({
        success: false,
        message: "Lỗi khi tạo màu",
        error: error.message,
      });
    }
  }

  /**
   * CẬP NHẬT MÀU
   * PUT /colors/:id
   */
  static async updateColor(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID màu không hợp lệ",
        });
      }

      const updatedColor = await Color.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updatedColor) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy màu để cập nhật",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật màu thành công",
        color: updatedColor,
      });
    } catch (error) {
      console.error("Lỗi updateColor:", error);
      res.status(400).json({
        success: false,
        message: "Lỗi khi cập nhật màu",
        error: error.message,
      });
    }
  }

  /**
   * XÓA MÀU (soft delete - set isActive: false)
   * DELETE /colors/:id
   */
  static async deleteColor(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID màu không hợp lệ",
        });
      }

      const color = await Color.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).lean();

      if (!color) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy màu để xóa",
        });
      }

      res.json({
        success: true,
        message: "Xóa màu thành công (soft delete)",
        color,
      });
    } catch (error) {
      console.error("Lỗi deleteColor:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi xóa màu",
        error: error.message,
      });
    }
  }

  // TẠO DỮ LIỆU MẪU
  static async seed(req, res) {
    try {
      await Color.deleteMany({});
      const data = require("../data/colors.js");
      const colorsData = data.colors;

      const colors = await Color.insertMany(colorsData);
      res.json({
        success: true,
        message: `Đã seed ${colors.length} màu mẫu`,
        colors,
      });
    } catch (error) {
      console.error("Lỗi seedColors:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi seed dữ liệu màu",
        error: error.message,
      });
    }
  }
}

module.exports = ColorController;
