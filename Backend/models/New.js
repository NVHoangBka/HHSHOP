// models/Article.js
const mongoose = require("mongoose");
const updateTagCounts = require("../utils/updateTagCounts.js");

const newSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    thumbnailAlt: {
      type: String,
      default: function () {
        return this.title;
      },
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],

    // SEO
    metaTitle: {
      type: String,
      default: function () {
        return this.title;
      },
    },
    metaDescription: {
      type: String,
      default: function () {
        return this.description;
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Tạo slug tự động
newSchema.pre("save", async function (next) {
  // Chỉ tạo slug nếu chưa có hoặc title bị thay đổi
  if (!this.slug || this.isModified("title")) {
    let baseSlug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (!baseSlug) baseSlug = "bai-viet";

    let slug = baseSlug;
    let counter = 1;
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }

  // Tự động publishedAt
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Tăng views
newSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Virtual: format ngày đẹp (05/06/2024)
newSchema.virtual("formattedDate").get(function () {
  return this.publishedAt.toLocaleDateString("vi-VN");
});

newSchema.post("save", () => updateTagCounts());
newSchema.post("findOneAndDelete", () => updateTagCounts());
newSchema.post("deleteMany", () => updateTagCounts());

module.exports = mongoose.model("New", newSchema);
