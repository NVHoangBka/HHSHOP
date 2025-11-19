// backend/models/Product.js (ĐÃ ĐƯỢC NÂNG CẤP HOÀN CHỈNH)

const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    image: { type: String },
    stock: { type: Number, default: 0 },
    sku: { type: String },
  },
  { _id: false }
);

const highlightSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // vd: "Đặc điểm nổi bật", "Thành phần", "Hướng dẫn sử dụng"
    content: { type: String, required: true }, // HTML content
    icon: { type: String, default: "bi bi-star-fill" }, // Bootstrap icon
    order: { type: Number, default: 0 }, // để sắp xếp
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },

    price: { type: Number, required: true },
    discountPrice: { type: Number },

    image: { type: String, required: true },
    gallery: [{ type: String }],

    variants: [variantSchema],

    description: { type: String },
    shortDescription: { type: String },

    // ĐÂY LÀ PHẦN MỚI – SIÊU MẠNH MẼ!
    highlightContent: {
      type: String,
      default: "",
    },
    // Hoặc dùng dạng section linh hoạt hơn (khuyên dùng cho admin đẹp)
    highlightSections: [highlightSectionSchema],

    // Phân loại
    types: { type: [String], default: [] },
    tag: { type: [String], default: [] },
    brands: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    titles: { type: [String], default: [] },
    subTitles: { type: [String], default: [] },

    // Trạng thái & số liệu
    isActive: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    falseSale: { type: Boolean, default: false },
    sold: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Index tìm kiếm
productSchema.index({
  name: "text",
  description: "text",
  brands: "text",
  tag: "text",
  highlightContent: "text", // thêm để tìm kiếm trong đặc điểm nổi bật
});

// Tạo slug tự động
productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
