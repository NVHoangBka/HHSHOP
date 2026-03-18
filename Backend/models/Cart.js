// backend/models/Cart.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantValue: {
    type: String,
    required: true,
    trim: true,
    default: "default",
  },
  quantity: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

// Index tìm kiếm nhanh
cartSchema.index({ userId: 1 });
cartSchema.index({ "items.productId": 1, "items.variantValue": 1 });

module.exports = mongoose.model("Cart", cartSchema);
