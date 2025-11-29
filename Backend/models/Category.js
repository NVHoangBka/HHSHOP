// models/Category.js (Danh mục)
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // "Rau củ quả", "Thịt tươi"
    slug: { type: String, unique: true },
    icon: { type: String, default: "bi bi-shop" }, // Bootstrap icon hoặc URL
    image: { type: String }, // Banner danh mục
    color: { type: String, default: "#10b981" }, // Màu chủ đạo (xanh lá, đỏ, cam...)
    order: { type: Number, default: 0 }, // Thứ tự hiển thị
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Cấp cha (nếu có)
    isActive: { type: Boolean, default: true, index: true },

    isFeatured: { type: Boolean, default: false, index: true }, // Hiển thị trang chủ
    homeOrder: { type: Number, default: 0 }, // Thứ tự ô danh mục
    icon: { type: String },
  },
  { timestamps: true }
);

// Tạo slug tự động
CategorySchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    const base = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    this.slug = `${base}-${Date.now().toString(36).substr(0, 4)}`;
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
