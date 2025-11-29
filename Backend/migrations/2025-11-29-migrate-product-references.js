// migrations/2025-03-29-add-brand-color-brand-tag-references.js

require("dotenv").config(); // để đọc .env
const mongoose = require("mongoose");

// Import các model mới (chú ý đúng đường dẫn)
const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Color = require("../models/Color");
const Tag = require("../models/Tag");

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Đã kết nối MongoDB");

    const total = await Product.countDocuments();
    console.log(`Tìm thấy ${total} sản phẩm. Bắt đầu migrate...`);

    let processed = 0;

    // Lấy từng sản phẩm (dùng cursor để không tải hết vào RAM)
    const cursor = Product.find({}).lean().batchSize(100).cursor();

    for await (const p of cursor) {
      const update = {};
      let needUpdate = false;

      // === 1. Brand ===
      if (p.brand && typeof p.brand === "string") {
        let brand = await Brand.findOne({
          name: { $regex: `^${p.brand.trim()}$`, $options: "i" },
        });

        if (!brand) {
          brand = await new Brand({ name: p.brand.trim() }).save();
          console.log(`Tạo mới Brand: ${brand.name}`);
        }
        update.brand = brand._id;
        needUpdate = true;
      }

      // === 2. Colors ===
      if (p.colors && Array.isArray(p.colors) && p.colors.length > 0) {
        const colorIds = [];
        for (let colorName of p.colors) {
          if (!colorName) continue;
          let color = await Color.findOne({
            name: { $regex: `^${colorName.trim()}$`, $options: "i" },
          });

          if (!color) {
            // Bạn có thể tự map hex nếu muốn, ở đây để tạm #000
            color = await new Color({
              name: colorName.trim(),
              value: "#000000",
              code: colorName.trim().toLowerCase().replace(/\s+/g, "-"),
            }).save();
            console.log(`Tạo mới Color: ${color.name}`);
          }
          colorIds.push(color._id);
        }
        update.colors = colorIds;
        needUpdate = true;
      }

      // === 3. Tags (trước đây là types: ["hot", "new", ...]) ===
      if (p.types && Array.isArray(p.types) && p.types.length > 0) {
        const tagIds = [];
        for (let tagName of p.types) {
          let tag = await Tag.findOne({
            name: { $regex: `^${tagName.trim()}$`, $options: "i" },
          });

          if (!tag) {
            tag = await new Tag({
              name: tagName.trim(),
              slug: tagName.trim().toLowerCase().replace(/\s+/g, "-"),
            }).save();
            console.log(`Tạo mới Tag: ${tag.name}`);
          }
          tagIds.push(tag._id);
        }
        update.tags = tagIds;
        needUpdate = true;
      }

      // === Cập nhật nếu có thay đổi ===
      if (needUpdate) {
        await Product.updateOne({ _id: p._id }, { $set: update });
      }

      processed++;
      if (processed % 100 === 0) {
        console.log(`Đã xử lý ${processed}/${total} sản phẩm...`);
      }
    }

    console.log("HOÀN THÀNH! Đã migrate xong tất cả sản phẩm");
  } catch (err) {
    console.error("Lỗi migrate:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

migrate();
