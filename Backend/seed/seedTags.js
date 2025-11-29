// Backend/seed/seedTags.js
const mongoose = require("mongoose");
const Tag = require("../models/Tag");

const tags = [
  { name: "hot", color: "#ef4444", icon: "fire" },
  { name: "new", color: "#10b981", icon: "sparkles" },
  { name: "bestseller", color: "#f59e0b", icon: "trophy" },
  { name: "freeship", color: "#8b5cf6", icon: "truck" },
  { name: "flashsale", color: "#dc2626", icon: "zap" },
  { name: "sale", color: "#ec4899", icon: "percent" },
];

async function seedTags() {
  await Tag.deleteMany({});
  const created = await Tag.insertMany(
    tags.map((t) => ({ ...t, slug: t.name }))
  );
  console.log(`Đã tạo ${created.length} tag thành công!`);
  return created;
}

module.exports = seedTags;
