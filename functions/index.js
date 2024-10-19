exports.checkPaidUser = functions.https.onRequest((req, res) => {
    cors({ origin: 'https://mimoki1.github.io' })(req, res, () => {
        if (req.method !== 'POST') {
            console.log('Invalid method: ', req.method);
            return res.status(405).send('Method Not Allowed');
        }

        try {
            console.log('Request body:', req.body);  // Log the request body to debug

            const email = req.body.email;  // Check if you're getting this correctly

            if (!email) {
                console.log('Email not provided in the request body');
                return res.status(400).send({ error: 'Email is required' });
            }

            const db = admin.firestore();
            const paidUsersRef = db.collection('paidUsers').where('email', '==', email);

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
                    console.error('Error getting documents: ', error);
                    return res.status(500).send({ error: 'Error checking paid user' });
                });
        } catch (err) {
            console.error('Request error: ', err);
            return res.status(400).send({ error: 'Invalid request, unable to process' });
        }
    });
});
