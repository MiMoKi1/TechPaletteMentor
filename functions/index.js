const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors'); // Initialize cors without options here

admin.initializeApp();

exports.checkPaidUser = functions.https.onRequest((req, res) => {
    // Use CORS middleware with the specified origin
    cors({ origin: 'https://mimoki1.github.io' })(req, res, () => {
        console.log('Request body:', req.body); // Log the request body

        // Check if the request method is POST
        if (req.method !== 'POST') {
            return res.status(403).send('Forbidden!');
        }

        const email = req.body.email;

        // Check if the email exists in the Firestore collection
        admin.firestore().collection('paidUser').doc(email).get()
            .then(doc => {
                if (doc.exists) {
                    // Access granted
                    return res.status(200).send({ accessGranted: true });
                } else {
                    // Access denied
                    return res.status(200).send({ accessGranted: false });
                }
            })
            .catch(error => {
                console.error("Error checking user access:", error);
                return res.status(500).send("Internal Server Error");
            });
    });
});
