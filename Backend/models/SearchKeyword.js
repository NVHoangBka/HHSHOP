const mongoose = require("mongoose");

const searchKeywordSchema = new mongoose.Schema(
  {
    keyword: {
      vi: String,
      en: String,
      cz: String,
    },
    count: { type: Number, default: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SearchKeyword", searchKeywordSchema);
