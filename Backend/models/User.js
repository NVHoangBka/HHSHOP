const mongoose = require('mongoose');

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
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  refreshToken: { type: String },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);