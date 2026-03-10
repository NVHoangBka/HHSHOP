const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    value: { type: String, require: true },
    label: { type: String, require: true },
    address: { type: String },
    phoneNumber: { type: String },
    map: { type: String },
  },
  { timeseries: true },
);

module.exports = mongoose.model("Store", StoreSchema);
