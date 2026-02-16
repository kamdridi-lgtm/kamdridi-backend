import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("KAMDRIDI backend running");
});

app.post("/create-checkout", async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: req.body.successUrl,
      cancel_url: req.body.cancelUrl,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
