const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors'); 
admin.initializeApp();


exports.checkPaidUser = functions.https.onRequest((req, res) => {
    cors({ origin: 'https://mimoki1.github.io' })(req, res, () => {
        console.log('Request body:', req.body);
        if (req.method !== 'POST') {
            console.log('Invalid method: ', req.method);
            return res.status(405).send('Method Not Allowed');
        }
        try {
            console.log('Request body:', req.body); // Log what the function is receiving

            if (req.method === 'POST') {
                const email = req.body.email;
                if (!email) {
                    console.log('Email not provided in the request body');
                    return res.status(400).send({ error: 'Email is required' });
                }

                // Firestore query to check if the email exists in the paidUsers collection
                const paidUsersRef = admin.firestore().collection('paidUsers').where('email', '==', email.toLowerCase());
                paidUsersRef.get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('No matching documents for email:', email);
                            return res.status(200).send({ isPaidUser: false });
                        }

                        console.log('User found in database:', email);
                        return res.status(200).send({ isPaidUser: true });
                    })
                    .catch(error => {
                        console.error('Error checking paid user:', error);
                        return res.status(500).send({ error: 'Internal Server Error' });
                    });
            } else {
                return res.status(405).send('Method Not Allowed');
            }
        } catch (err) {
            console.error('Request error: ', err);
            return res.status(400).send({ error: 'Invalid request, unable to process' });
        }
    });
});

