// backend/models/Title.js
const mongoose = require('mongoose');

const subTitleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

const titleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  type: { type: String },
  path: { type: String, required: true, unique: true },
  subTitles: [subTitleSchema]
}, { timestamps: true });

module.exports = mongoose.model('Title', titleSchema);