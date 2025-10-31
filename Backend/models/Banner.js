// backend/models/Title.js
const mongoose = require('mongoose');


const bannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  type: { type: String },
  path: { type: String},
  type: { type: String },
  showHome: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);