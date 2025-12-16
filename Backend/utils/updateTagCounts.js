// utils/updateTagCounts.js – PHIÊN BẢN FIX LỖI FILTER + TỐI ƯU

console.log(">>> updateTagCounts.js ĐÃ ĐƯỢC LOAD <<<");

const mongoose = require("mongoose");

const updateTagCounts = async () => {
  try {
    const Tag = mongoose.model("Tag");
    const Product = mongoose.model("Product");
    const New = mongoose.model("New");

    // Lấy thống kê từ Product
    const productStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$tags", productCount: { $sum: 1 } } },
    ]);

    // Lấy thống kê từ Article (New)
    const articleStats = await New.aggregate([
      { $match: { isPublished: true } },
      { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$tags", articleCount: { $sum: 1 } } },
    ]);

    // Chuyển sang map để dễ tra cứu
    const productMap = {};
    productStats.forEach((stat) => {
      if (stat._id) productMap[stat._id.toString()] = stat.productCount;
    });

    const articleMap = {};
    articleStats.forEach((stat) => {
      if (stat._id) articleMap[stat._id.toString()] = stat.articleCount;
    });

    // Lấy danh sách tất cả tagId xuất hiện (loại trùng + loại null)
    const allTagIds = Array.from(
      new Set([...Object.keys(productMap), ...Object.keys(articleMap)])
    );

    // Tạo bulk operations
    const bulkOps = allTagIds.map((tagId) => {
      const productCount = productMap[tagId] || 0;
      const articleCount = articleMap[tagId] || 0;
      const type =
        productCount > 0 && articleCount > 0
          ? "both"
          : productCount > 0
          ? "product"
          : articleCount > 0
          ? "article"
          : "both";

      return {
        updateOne: {
          filter: { _id: tagId },
          update: { productCount, articleCount, type },
        },
      };
    });

    // Thực thi bulk nếu có
    if (bulkOps.length > 0) {
      await Tag.bulkWrite(bulkOps);
    }

    // Reset các tag không còn được sử dụng
    await Tag.updateMany(
      { _id: { $nin: allTagIds } },
      { productCount: 0, articleCount: 0, type: "both" }
    );

    console.log(
      `Tag counts updated successfully - Affected tags: ${allTagIds.length}`
    );
  } catch (error) {
    console.error("Error updating tag counts:", error);
  }
};

module.exports = { updateTagCounts };
