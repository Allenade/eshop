import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as stripe from "stripe";

dotenv.config();

const app = express();
const stripeInstance = new stripe.Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: "2020-08-27",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to eshop website.");
});

const calculateOrderAmount = (items) => {
  // Implement logic to calculate order amount based on items
  // For example, sum up prices of all items
  return items.reduce((total, item) => total + item.price, 0);
};

app.post("/create-payment-intent", async (req, res) => {
  const { items, description, shipping, customerEmail } = req.body;

  // Create a PaymentIntent with the order amount and currency
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
    receipt_email: customerEmail,
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
