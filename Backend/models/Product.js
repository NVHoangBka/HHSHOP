// backend/models/Product.js
const mongoose = require("mongoose");
const slugify = require("slugify");
const { updateTagCounts } = require("../utils/updateTagCounts");

const variantSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true }, // vd: "Đỏ", "128GB", "Size L"
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    image: { type: String }, // ảnh riêng cho từng phân loại
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true }, // mã riêng
    sold: { type: Number, default: 0 }, // bán riêng từng loại
  },
  { _id: false, timestamps: true }
);

const highlightSectionSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String }, // hỗ trợ HTML
    icon: { type: String, default: "bi bi-star-fill" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: [{ type: String }],
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      vi: { type: String, trim: true },
      en: { type: String, trim: true },
      cz: { type: String, trim: true },
    },
    slug: {
      vi: { type: String, unique: true, sparse: true },
      en: { type: String, unique: true, sparse: true },
      cz: { type: String, unique: true, sparse: true },
    },

    // Giá cơ bản (nếu không có variants)
    price: { type: Number },
    discountPrice: { type: Number },

    // Ảnh chính + gallery
    image: { type: String },
    gallery: [{ type: String }],

    // Phân loại mạnh mẽ
    variants: [variantSchema],

    // Nội dung chi tiết
    shortDescription: { type: String, maxlength: 500 },
    description: {
      vi: { type: String },
      en: { type: String },
      cz: { type: String },
    }, // HTML content
    highlightContent: { type: String }, // fallback cũ
    highlightSections: [highlightSectionSchema], // MỚI – SIÊU ĐẸP

    // Phân loại tìm kiếm
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", index: true },
    colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        index: true,
      },
    ],
    // Thuộc tính động (dung tích, kích thước, chất liệu...)
    attributes: [
      {
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute" },
        value: String,
      },
    ],

    // Đánh giá & tương tác
    reviews: [reviewSchema],
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // Trạng thái & số liệu
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    totalStock: { type: Number, default: 0 }, // tổng tồn tất cả variants
    totalSold: { type: Number, default: 0 }, // tổng đã bán
    viewCount: { type: Number, default: 0 },
    flashSale: { type: Boolean, default: false }, // flash sale giả
    flashSaleEnd: { type: Date }, // kết thúc flash sale
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== VIRTUALS SIÊU MẠNH ====================

// Giá thấp nhất (dùng cho hiển thị)
productSchema.virtual("finalPrice").get(function () {
  if (this.variants && this.variants.length > 0) {
    const prices = this.variants
      .map((v) => v.discountPrice || v.price)
      .filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : this.price;
  }
  return this.discountPrice || this.price || 0;
});

// Tổng tồn kho
productSchema.virtual("stock").get(function () {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  return this.totalStock || 0;
});

productSchema.virtual("tagNames", {
  ref: "Tag",
  localField: "tags",
  foreignField: "_id",
  justOne: false,
  options: { select: "name" },
});
// ==================== INDEX TÌM KIẾM SIÊU NHANH ====================
productSchema.index({
  name: "text",
  description: "text",
  "highlightSections.title": "text",
  "highlightSections.content": "text",
  "$**": "text",
});

// Index tìm kiếm nhanh
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// ==================== PRE SAVE – TỰ ĐỘNG HOÁ ====================
productSchema.pre("save", function (next) {
  const languages = ["vi", "en", "cz"];
  // Tạo slug
  for (const lang of languages) {
    const nameLang = this.name[lang] || this.name.vi; // fallback về vi nếu thiếu
    if (nameLang && (this.isModified(`name.${lang}`) || !this.slug[lang])) {
      this.slug[lang] = slugify(nameLang, {
        lower: true,
        strict: true,
        locale: lang === "vi" ? "vi" : "en",
      });
    }
  }

  // Nếu có variants → bỏ giá gốc
  if (this.variants?.length > 0) {
    this.price = undefined;
    this.discountPrice = undefined;
    this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
    this.totalSold = this.variants.reduce((sum, v) => sum + v.sold, 0);
  } else {
    this.variants = [];
  }

  // inStock tự động
  this.inStock = this.stock > 0;
  next();
});

// ==================== STATIC METHODS ====================
productSchema.statics.search = function (query) {
  return this.find({ $text: { $search: query } }).sort({
    score: { $meta: "textScore" },
  });
};

module.exports = mongoose.model("Product", productSchema);
