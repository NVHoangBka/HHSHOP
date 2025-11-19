// backend/models/Product.js
const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    value: { type: String, required: true }, // vd: "Chai 900g", "Can 3.6kg", "Hương Hoa Hồng"
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // giá khuyến mãi của variant
    image: { type: String }, // ảnh riêng (nếu khác ảnh chính)
    stock: { type: Number, default: 0 }, // số lượng tồn kho
    sku: { type: String }, // mã SKU riêng (tùy chọn)
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      unique: true,
      sparse: true, // THÊM DÒNG NÀY
    }, // dùng cho SEO (tự sinh từ name)

    // Giá mặc định (khi không có variant)
    price: { type: Number, required: true },
    discountPrice: { type: Number },

    // Ảnh
    image: { type: String, required: true }, // ảnh chính
    gallery: [{ type: String }], // mảng nhiều ảnh phụ

    // Variant (dung tích, màu, mùi…)
    variants: [variantSchema],

    // Thông tin bổ sung
    description: { type: String },
    shortDescription: { type: String }, // mô tả ngắn cho card

    // Phân loại
    types: { type: [String], default: [] }, // vd: ["nuoc-lau-san", "cham-soc-nha-cua"]
    tag: { type: [String], default: [] }, // ["ban-chay", "giam-gia", "moi"]
    brands: { type: [String], default: [] },
    colors: { type: [String], default: [] },

    // Danh mục động (dùng cho route)
    titles: { type: [String], default: [] }, // vd: ["Sản phẩm tẩy rửa"]
    subTitles: { type: [String], default: [] }, // vd: ["Nước lau sàn"]

    // Trạng thái
    isActive: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    falseSale: { type: Boolean, default: false }, // giả vờ giảm giá

    // Số liệu
    sold: { type: Number, default: 0 }, // đã bán
    viewCount: { type: Number, default: 0 }, // lượt xem
  },
  {
    timestamps: true, // tự động thêm createdAt, updatedAt
  }
);

// Tạo index tìm kiếm full-text
productSchema.index({
  name: "text",
  description: "text",
  brands: "text",
  tag: "text",
});

// Tự động tạo slug từ name (trước khi save)
productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
