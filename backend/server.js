// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for tokens (for demonstration only)
const tokensStore = {};

// Generate a unique token
const generateToken = () => {
    return Math.random().toString(36).substring(2);
};

// Endpoint to handle Stripe payment and generate a token
app.post('/pay', async (req, res) => {
    try {
        const { amount, paymentMethodId, userId } = req.body;

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        // Generate a token and store it
        const token = generateToken();
        tokensStore[userId] = token; // Use userId to link token to the user

        res.json({ payment, token }); // Send the token back to the client
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to check if the user has access based on the token
app.get('/check-token/:userId', (req, res) => {
    const userId = req.params.userId;

    // Check if the user has a valid token
    const hasAccess = tokensStore[userId] !== undefined;

    res.json({ hasAccess });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
