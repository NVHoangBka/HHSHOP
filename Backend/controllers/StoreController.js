// controllers/StoreController.js
const Store = require("../models/Store");

class StoreController {
  // Lấy tất cả stores (dùng cho filter frontend + admin)
  static async getAllStores(req, res) {
    try {
      const stores = await Store.find();
      res.json({ success: true, stores });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Admin: Tạo mới
  static async createStore(req, res) {
    try {
      const { name, description, icon, image, order } = req.body;
      const store = new Store({
        name: { vi: name.vi, en: name.en || name.vi, cz: name.cz || name.vi },
        description: description || {},
        icon,
        image,
        order: order || 0,
      });
      await store.save();
      res.status(201).json({ success: true, store });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Admin: Cập nhật
  static async updateStore(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const store = await Store.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!store)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });
      res.json({ success: true, store });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Admin: Xóa (kiểm tra productCount)
  static async deleteStore(req, res) {
    try {
      const { id } = req.params;
      const store = await Store.findById(id);
      if (!store) return res.status(404).json({ success: false });

      if (store.productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Còn ${store.productCount} sản phẩm đang dùng loại này. Không thể xóa.`,
        });
      }

      await Store.findByIdAndDelete(id);
      res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // TẠO DỮ LIỆU MẪU
  static async seed(req, res) {
    try {
      await Store.deleteMany({});

      const data = require("../data/stores");
      const storesData = data.stores;

      const inserted = [];

      for (const item of storesData) {
        const store = new Store(item);
        await store.save();
        inserted.push(store);
      }
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

module.exports = StoreController;
