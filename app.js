// app.js
function handlePayment() {
    const paymentData = {
        amount: 5000, // amount in cents (e.g., $50.00)
        paymentMethodId: 'pm_card_visa', // This should come from your Stripe integration
        userId: 'USER_ID' // Replace this with the actual logged-in user's ID
    };

    fetch('https://techpalettementorback-710cc139297d.herokuapp.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            console.log('Payment successful, token:', data.token);
            // Store the token in local storage or cookies for future access
            localStorage.setItem('userToken', data.token);
        } else {
            console.error('Payment failed:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function checkAccess() {
    const userId = 'USER_ID'; // Get the logged-in user's ID
    fetch(`https://techpalettementorback-710cc139297d.herokuapp.com//check-token/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.hasAccess) {
                console.log('Access granted!');
                // Load your app features
            } else {
                console.error('Access denied.');
                // Redirect to payment or login page
            }
        })
        .catch(error => {
            console.error('Error checking access:', error);
        });
}

// Call checkAccess on page load
document.addEventListener('DOMContentLoaded', checkAccess);
