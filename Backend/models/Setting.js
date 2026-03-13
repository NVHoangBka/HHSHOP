// backend/models/Setting.js
const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      enum: [
        "site_logo",
        "site_favicon",
        "banner_home",
        "footer_text",
        "facebook_link",
        "zalo_link",
        "phone_contact",
        "email_contact",
        "address",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      e,
    },
    type: {
      type: String,
      enum: ["text", "image", "url", "array_image"],
      default: "text",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

// Tự động set name mặc định nếu không nhập (dựa trên key)
settingSchema.pre("save", function (next) {
  if (!this.name) {
    // Tạo tên mặc định từ key, thay _ bằng space và capitalize
    this.name = this.key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  next();
});

module.exports = mongoose.model("Setting", settingSchema);
