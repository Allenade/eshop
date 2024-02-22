// import dotenv from "dotenv";
const dotenv = require('dotenv').config(process.env);
import express from "express";
import cors from "cors";
import * as stripe from "stripe";

dotenv.config();

const app = express();

const stripeInstance = new stripe.Stripe(process.env.VITE_APP_STRIPE_PK, {
  apiVersion: "2020-08-27",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to eshop website.");
});

const calculateOrderAmount = (items) => {
  const itemAmounts = items.map(
    ({ price, cartQuantity }) => price * cartQuantity
  );
  const totalAmount = itemAmounts.reduce((total, amount) => total + amount, 0);
  return totalAmount * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { items, description, shipping } = req.body;

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      payment_method_types: ["card"],
      description,
      shipping: {
        address: {
          line1: shipping.line1,
          line2: shipping.line2,
          city: shipping.city,
          country: shipping.country,
          postal_code: shipping.postal_code,
        },
        name: shipping.name,
        phone: shipping.phone,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.VITE_APP_STRIPE_PK || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
