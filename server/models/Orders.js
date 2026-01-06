const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: String,
  items: Array,
  amount: Number,
  status: String,
  transactionID: String
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);