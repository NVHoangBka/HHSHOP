// backend/models/Order.js

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: { type: String, required: true, unique: true, index: true },

    shippingAddress: {
      recipientName: String,
      phoneNumber: String,
      addressLine: String,
      ward: String,
      district: String,
      city: String,
    },

    items: [orderItemSchema],

    subTotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0 },
    voucherCode: String,
    voucherDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    note: String,

    paymentMethod: {
      type: String,
      enum: ["COD", "BANK"],
      default: "COD",
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paidAt: Date,

    paymentQR: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentQR",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "shipped",
        "delivered",
        "canceled",
        "returned",
      ],
      default: "pending",
      index: true,
    },

    // Thời gian theo trạng thái đơn hàng
    confirmedAt: Date,
    preparingAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    canceledAt: Date,
    returnedAt: Date,
  },
  { timestamps: true }
);

// ===========================================================================
// TỰ ĐỘNG CẬP NHẬT THỜI GIAN KHI THAY ĐỔI status HOẶC paymentStatus
// ===========================================================================

// 1. Khi tạo mới đơn hàng (save)
orderSchema.pre("save", function (next) {
  if (this.isNew) {
    // Đơn mới tạo → mặc định là pending
    this.confirmedAt =
      this.preparingAt =
      this.shippedAt =
      this.deliveredAt =
      this.canceledAt =
      this.returnedAt =
        undefined;
  }
  next();
});

// 2. Khi update (findOneAndUpdate, findByIdAndUpdate, updateOne, ...)
orderSchema.pre(
  ["updateOne", "findOneAndUpdate", "update"],
  async function (next) {
    const update = this.getUpdate();

    // Nếu không update status hay paymentStatus → bỏ qua
    if (
      !update.status &&
      !update.paymentStatus &&
      !update.$set?.status &&
      !update.$set?.paymentStatus
    ) {
      return next();
    }

    try {
      // Lấy document hiện tại để biết trạng thái cũ
      const doc = await this.model.findOne(this.getQuery());
      if (!doc) return next();

      const now = new Date();

      // === XỬ LÝ TRẠNG THÁI ĐƠN HÀNG ===
      const newStatus = update.status || update.$set?.status;
      if (newStatus && newStatus !== doc.status) {
        const timestampMap = {
          confirmed: "confirmedAt",
          preparing: "preparingAt",
          shipped: "shippedAt",
          delivered: "deliveredAt",
          canceled: "canceledAt",
          returned: "returnedAt",
        };

        const field = timestampMap[newStatus];
        if (field) {
          if (update.$set) {
            update.$set[field] = now;
          } else {
            update[field] = now;
          }
        }

        // Bonus: Nếu giao thành công + là COD → tự động đánh dấu đã thanh toán
        if (newStatus === "delivered" && doc.paymentMethod === "COD") {
          if (update.$set) {
            update.$set.paymentStatus = "paid";
            update.$set.paidAt = now;
          } else {
            update.paymentStatus = "paid";
            update.paidAt = now;
          }
        }
      }

      // === XỬ LÝ TRẠNG THÁI THANH TOÁN ===
      const newPaymentStatus =
        update.paymentStatus || update.$set?.paymentStatus;
      if (
        newPaymentStatus &&
        newPaymentStatus !== doc.paymentStatus &&
        newPaymentStatus === "paid"
      ) {
        if (update.$set) {
          update.$set.paidAt = now;
        } else {
          update.paidAt = now;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  }
);

// Index tìm kiếm nhanh
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderId: 1 });

module.exports = mongoose.model("Order", orderSchema);
