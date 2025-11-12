// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  image: { type: String, required: true },
  description: { type: String },
  types: { type: [String], default: [] },
  tag: { type: [String], default: [] },
  brands: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  titles: { type: [String], default: [] },
  subTitles: { type: [String], default: [] },
});

module.exports = mongoose.model("Product", productSchema);
