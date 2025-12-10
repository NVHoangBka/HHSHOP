const Tag = require("../models/Tag.js");
const Product = require("../models/Product");
const New = require("../models/New");

const updateTagCounts = async () => {
  try {
    const tags = await Tag.find();

    for (const tag of tags) {
      const newCount = await New.countDocuments({
        tags: tag._id,
        isPublished: true,
      });

      const productCount = await Product.countDocuments({
        tags: tag._id,
        isActive: true,
      });

      await Tag.updateOne(
        { _id: tag._id },
        {
          articleCount,
          productCount,
          type:
            newCount > 0 && productCount > 0
              ? "both"
              : newCount > 0
              ? "article"
              : productCount > 0
              ? "product"
              : "both",
        }
      );
    }
    console.log("Tag counts updated successfully");
  } catch (error) {
    console.error("Error updating tag counts:", error);
  }
};

module.exports = { updateTagCounts };
