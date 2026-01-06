require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("./models/Orders");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const orders = await Order.find();
  console.log("\nORDERS IN DATABASE:\n", orders);
  process.exit();
}

run();