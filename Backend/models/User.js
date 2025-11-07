const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, trim: true },
  address: { type: String, trim: true },
  cart: [{ id: String, name: String, price: Number, quantity: Number }],
  orders: [
    {
      id: String,
      items: Array,
      total: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  role: { type: String, default: "user", enum: ["user", "admin"] },
  refreshToken: { type: String },
});

userSchema.pre("save", async function (next) {
  // CHỈ HASH KHI ĐĂNG KÝ (password là plain text)
  if (
    this.isModified("password") &&
    !this.password.startsWith("$2a$") &&
    !this.password.startsWith("$2b$")
  ) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
