// models/Brand.js
const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true },
    logo: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

BrandSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

module.exports = mongoose.model("Brand", BrandSchema);
