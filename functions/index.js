const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors'); 

admin.initializeApp();

exports.checkPaidUser = functions.https.onRequest((req, res) => {
    cors({ origin: 'https://mimoki1.github.io' })(req, res, () => {
        console.log('Request body:', req.body);

        if (req.method === 'POST') {
            const email = req.body.email;
            if (!email) {
                return res.status(400).send({ error: 'Email is required' });
            }

            const db = admin.firestore();
            const paidUsersRef = db.collection('paidUsers').where('email', '==', email);

            paidUsersRef.get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        return res.status(200).send({ isPaidUser: false });
                    }

                    return res.status(200).send({ isPaidUser: true });
                })
                .catch(error => {
                    console.error('Error checking paid user:', error);
                    return res.status(500).send({ error: 'Internal Server Error' });
                });
        } else {
            return res.status(405).send('Method Not Allowed');
        }
    });
});
