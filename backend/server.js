
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe for payments
require('dotenv').config(); // To use environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false }
});

// Endpoint to check if user has paid (simple example)
app.get('/check-payment/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const { rows } = await pool.query('SELECT has_paid FROM users WHERE id = $1', [userId]);
        if (rows.length > 0) {
            res.json({ hasPaid: rows[0].has_paid });
        } else {
            res.json({ hasPaid: false });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
