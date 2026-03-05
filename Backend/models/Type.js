// models/Type.js
const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema(
  {
    name: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, trim: true },
      cz: { type: String, trim: true },
    },
    slug: {
      vi: { type: String, unique: true, sparse: true, lowercase: true },
      en: { type: String, unique: true, sparse: true, lowercase: true },
      cz: { type: String, unique: true, sparse: true, lowercase: true },
    },
    description: {
      vi: { type: String },
      en: { type: String },
      cz: { type: String },
    },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Tự động tạo slug giống Product
typeSchema.pre("save", function (next) {
  const languages = ["vi", "en", "cz"];
  for (const lang of languages) {
    const nameLang = this.name[lang] || this.name.vi;
    if (nameLang && (this.isModified(`name.${lang}`) || !this.slug?.[lang])) {
      this.slug[lang] = require("slugify")(nameLang, {
        lower: true,
        strict: true,
        locale: lang === "vi" ? "vi" : "en",
      });
    }
  }
  next();
});

// Tăng/giảm productCount khi thêm/xóa type trong product (dùng middleware hoặc controller)
typeSchema.statics.updateProductCount = async function (typeId, delta = 1) {
  await this.findByIdAndUpdate(typeId, { $inc: { productCount: delta } });
};

module.exports = mongoose.model("Type", typeSchema);
