// backend/models/Address.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipientName: String,
  phoneNumber: String,
  addressLine: String,
  ward: String,
  district: String,
  city: String,
  isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model("Address", addressSchema);
