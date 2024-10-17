// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); // Replace with your Stripe secret key

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to check payment status
app.get('/check-payment/:userId', async (req, res) => {
    const userId = req.params.userId;

    // Logic to check if the user has paid, e.g., query your database
    // For simplicity, let's assume the user has paid if they have a specific ID
    const hasPaid = userId === 'VALID_USER_ID'; // Replace with your actual logic

    res.json({ hasPaid });
});

// Endpoint to handle Stripe payment
app.post('/pay', async (req, res) => {
    try {
        const { amount, paymentMethodId } = req.body;

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        res.json(payment);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
