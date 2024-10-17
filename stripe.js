// Initialize Stripe
const stripe = Stripe('pk_live_51QAUaLIcCV1uZ856dNizRkc41p6GdHdxSpa91BcPfVLthFKC79e1zqyP169SsTkmQunQLCGeCFqZlIWYOeeFFcoA003NXZ8J1V'); 

// Get the checkout button element
const checkoutButton = document.getElementById('stripeCheckoutBtn');

// Add an event listener to the checkout button
checkoutButton.addEventListener('click', function () {
    // Call your backend to create a Checkout Session
    fetch('https://techpalettementorback-710cc139297d.herokuapp.com/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(session => {
        // Redirect to Checkout
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(result => {
        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            alert(result.error.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your payment. Please try again.');
    });
});
