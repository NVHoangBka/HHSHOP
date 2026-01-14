// models/Color.js – PHIÊN BẢN HOÀN CHỈNH, ĐA NGÔN NGỮ (vi/en/cz)
const mongoose = require("mongoose");
const slugify = require("slugify");

const ColorSchema = new mongoose.Schema(
  {
    name: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, trim: true },
      cz: { type: String, trim: true },
    },
    value: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Kiểm tra định dạng màu hợp lệ: hex (#RRGGBB hoặc #RGB), rgb(), rgba(), tên màu (red, blue...)
          return (
            /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || // hex
            /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(v) ||
            /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[0-1]?\.?\d+\s*\)$/.test(
              v
            ) ||
            /^(red|blue|green|yellow|black|white|gray|grey|purple|pink|orange|brown|cyan|magenta|teal|indigo|violet|olive|maroon|navy|aquamarine|turquoise|gold|silver|coral|salmon|plum|orchid|beige|ivory|khaki|lavender|linen|mintcream|oldlace|papayawhip|peachpuff|seashell|snow|thistle|wheat)$/i.test(
              v
            )
          );
        },
        message:
          "Giá trị màu không hợp lệ (hỗ trợ hex, rgb/rgba hoặc tên màu chuẩn)",
      },
    },
    slug: {
      vi: { type: String, unique: true, sparse: true },
      en: { type: String, unique: true, sparse: true },
      cz: { type: String, unique: true, sparse: true },
    },
    description: {
      vi: { type: String, maxlength: 200 },
      en: { type: String, maxlength: 200 },
      cz: { type: String, maxlength: 200 },
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== PRE SAVE ====================
ColorSchema.pre("save", async function (next) {
  const languages = ["vi", "en", "cz"];

  for (const lang of languages) {
    const nameLang = this.name[lang] || this.name.vi;
    if (nameLang && (this.isModified(`name.${lang}`) || !this.slug?.[lang])) {
      this.slug = this.slug || {};
      this.slug[lang] =
        slugify(nameLang, {
          lower: true,
          strict: true,
          locale: lang === "vi" ? "vi" : "en",
        }) +
        "-" +
        Date.now().toString(36).slice(-4);
    }
  }

  next();
});

// ==================== INDEX ====================
ColorSchema.index({ "name.vi": 1 });
ColorSchema.index({ "name.en": 1 });
ColorSchema.index({ "name.cz": 1 });
ColorSchema.index({ value: 1 });
ColorSchema.index({ isActive: 1 });

// ==================== VIRTUALS ====================

// ==================== STATIC METHODS ====================
ColorSchema.statics.findByLang = async function (lang = "vi", search = "") {
  const query = { isActive: true };
  if (search) {
    query[`name.${lang}`] = { $regex: search, $options: "i" };
  }
  return this.find(query).sort({ "name.vi": 1 }).lean();
};

ColorSchema.statics.getAllActive = async function () {
  return this.find({ isActive: true }).sort({ "name.vi": 1 }).lean();
};

module.exports = mongoose.model("Color", ColorSchema);
