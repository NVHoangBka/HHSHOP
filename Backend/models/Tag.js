// models/Tag.js (từng dùng cho "hot", "new", "bestseller", "freeship"...)
const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    color: { type: String, default: "#ef4444" }, // màu badge
    icon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", TagSchema);
