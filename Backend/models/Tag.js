// models/Tag.js
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // "Chống lão hóa", "Giảm giá", "Trái cây nhập khẩu"...
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["article", "product", "both"],
      default: "both", // "both" = dùng được cho cả bài viết và sản phẩm
    },
    description: String,
    // Đếm số lượng từng loại
    newCount: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Tạo slug tiếng Việt đẹp
tagSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    let slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    this.slug = slug;
  }
  next();
});

// Virtual: tổng số lần xuất hiện
tagSchema.virtual("totalCount").get(function () {
  return this.newCount + this.productCount;
});

module.exports = mongoose.model("Tag", tagSchema);
