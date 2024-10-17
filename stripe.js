
const stripe = require('stripe')('pk_live_51QAUaLIcCV1uZ856dNizRkc41p6GdHdxSpa91BcPfVLthFKC79e1zqyP169SsTkmQunQLCGeCFqZlIWYOeeFFcoA003NXZ8J1V'); // Replace with your actual Stripe secret key

// Example endpoint for creating a checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body; // Assuming you're sending item details from the frontend

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd', // Change as needed
                    product_data: {
                        name: item.name, // Replace with actual item name
                        images: [item.image], // Replace with actual item image
                    },
                    unit_amount: item.price * 100, // Price in cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: 'https://your-success-url.com', // Replace with your success URL
            cancel_url: 'https://your-cancel-url.com', // Replace with your cancel URL
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
