// models/Attribute.js  ← Siêu mạnh (thay thế types, sizes, dung tích, chất liệu...)
const mongoose = require("mongoose");

const AttributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "Dung tích", "Chất liệu", "Kích thước"
    slug: String,
    values: [{ type: String }], // ["500ml", "1 lít", "Inox 304", "Size L"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attribute", AttributeSchema);
