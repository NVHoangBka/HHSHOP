// models/Category.js – PHIÊN BẢN ĐA NGÔN NGỮ (vi/en/cz) + THÊM VALUE
const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, trim: true },
      cz: { type: String, trim: true },
    },
    slug: {
      vi: { type: String, unique: true, sparse: true },
      en: { type: String, unique: true, sparse: true },
      cz: { type: String, unique: true, sparse: true },
    },
    description: {
      vi: { type: String, maxlength: 500 },
      en: { type: String, maxlength: 500 },
      cz: { type: String, maxlength: 500 },
    },

    value: {
      vi: { type: String, unique: true, sparse: true },
      en: { type: String, unique: true, sparse: true },
      cz: { type: String, unique: true, sparse: true },
    },

    icon: { type: String, default: "bi bi-shop" },
    image: { type: String }, // Banner danh mục
    color: { type: String, default: "#10b981" },
    order: { type: Number, default: 0 },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    level: { type: Number, default: 0, index: true },

    // SEO đa ngôn ngữ
    metaTitle: {
      vi: { type: String, maxlength: 100 },
      en: { type: String, maxlength: 100 },
      cz: { type: String, maxlength: 100 },
    },
    metaDescription: {
      vi: { type: String, maxlength: 300 },
      en: { type: String, maxlength: 300 },
      cz: { type: String, maxlength: 300 },
    },

    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    homeOrder: { type: Number, default: 0 },

    // Cache (tùy chọn)
    productCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== PRE SAVE – TỰ ĐỘNG SLUG ĐA NGÔN NGỮ ====================
CategorySchema.pre("save", async function (next) {
  const languages = ["vi", "en", "cz"];

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

  for (const lang of languages) {
    const nameLang = this.name[lang] || this.name.vi; // fallback về vi nếu thiếu
    if (nameLang && (this.isModified(`name.${lang}`) || !this.value[lang])) {
      this.value[lang] = slugify(nameLang, {
        lower: true,
        strict: true,
        locale: lang === "vi" ? "vi" : "en",
      });
    }
  }

  // Level tự động
  if (this.isModified("parent") || this.isNew) {
    if (!this.parent) {
      this.level = 0;
    } else {
      const parentCat = await this.constructor
        .findById(this.parent)
        .select("level");
      this.level = parentCat ? parentCat.level + 1 : 0;
    }
  }

  next();
});

// ==================== INDEX ====================
CategorySchema.index({ "slug.vi": 1 });
CategorySchema.index({ "slug.en": 1 });
CategorySchema.index({ "slug.cz": 1 });
CategorySchema.index({ parent: 1, order: 1 });
CategorySchema.index({ isActive: 1, isFeatured: 1, homeOrder: 1 });
CategorySchema.index({ value: 1 }); // thêm index cho value để query nhanh

// ==================== VIRTUALS ====================
CategorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
  justOne: false,
});

// ==================== STATIC METHODS ====================
CategorySchema.statics.getByLang = async function (lang = "vi") {
  return this.find({ isActive: true }).sort({ order: 1 });
};

CategorySchema.statics.getTreeByLang = async function (lang = "vi") {
  const categories = await this.find({ isActive: true }).sort({ order: 1 });
  const map = {};
  const roots = [];

  categories.forEach((cat) => {
    cat.children = [];
    map[cat._id.toString()] = cat;
    if (!cat.parent) {
      roots.push(cat);
    } else if (map[cat.parent.toString()]) {
      map[cat.parent.toString()].children.push(cat);
    }
  });

  return roots;
};

// Thêm static method tiện lợi để tìm theo value
CategorySchema.statics.findByValue = async function (value) {
  return this.findOne({ value, isActive: true }).lean();
};

module.exports = mongoose.model("Category", CategorySchema);
