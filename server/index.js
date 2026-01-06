require("dotenv").config();
console.log("loaded Stripe key:", process.env.STRIPE_SECRET_KEY);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("./models/Orders");

const app = express();
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    Order.findOneAndUpdate(
      { transactionID: session.id },
      { status: "success" }
    ).then(() => console.log("Order marked as SUCCESS"));
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object;

    Order.findOneAndUpdate(
      { transactionID: session.id },
      { status: "failed" }
    ).then(() => console.log("Order marked as FAILED"));
  }

  res.json({ received: true });
});
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));
app.post("/create-checkout-session", async (req, res) => {
    console.log("REQ BODY:", req.body);
  try {
    const { email, items } = req.body;

    if (!email || !items || !items.length) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: items.map(item => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100
        },
        quantity: item.qty
      })),
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failure"
    });

    await Order.create({
      email,
      items,
      amount: items.reduce((t, i) => t + i.price * i.qty, 0),
      status: "pending",
      transactionID: session.id
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.listen(5000, () => console.log("Server running on 5000"));