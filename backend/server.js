// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(bodyParser.json());

// Payment Route
app.post('/pay', async (req, res) => {
  try {
    const { amount, paymentMethodId, userId } = req.body;

    // Create payment intent with Stripe
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    // Store the payment status in PostgreSQL
    await pool.query(
      'UPDATE users SET has_paid = $1 WHERE id = $2',
      [true, userId]
    );

    res.json({ success: true, message: 'Payment successful' });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// Check if user has paid
app.get('/check-payment/:userId', async (req, res) => {
  const userId = req.params.userId;

  const result = await pool.query('SELECT has_paid FROM users WHERE id = $1', [userId]);
  const hasPaid = result.rows[0].has_paid;

  res.json({ hasPaid });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
