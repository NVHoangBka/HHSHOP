// models/Promotion.js (Khuyến mãi)
const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // "Mua 2 tặng 1 Sữa Vinamilk"
    type: {
      type: String,
      enum: ["buyXgetY", "discount", "bundle", "gift", "combo"],
      required: true,
    },
    description: { type: String },
    banner: { type: String }, // Ảnh banner khuyến mãi
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Áp dụng cho sản phẩm nào
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    // Cấu hình chi tiết
    buyQuantity: { type: Number }, // Mua bao nhiêu
    getQuantity: { type: Number }, // Tặng bao nhiêu (buy 2 get 1 → buy=2, get=1)
    discountPercent: { type: Number }, // Giảm % nếu type = discount
    bundlePrice: { type: Number }, // Giá combo

    isActive: { type: Boolean, default: true, index: true },
    isHomeBanner: { type: Boolean, default: false }, // Hiển thị banner lớn trang chủ
    homeOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", PromotionSchema);
