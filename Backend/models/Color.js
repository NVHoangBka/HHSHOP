// models/Color.js
const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "Đỏ tươi", "Xanh ngọc"
    value: { type: String, required: true }, // "#ff0000", "#10b981"
    code: { type: String, unique: true }, // "red", "green"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", ColorSchema);
