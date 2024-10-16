const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: 'https://mimoki1.github.io' }); // Specify your allowed origin

admin.initializeApp();

exports.checkPaidUsers = functions.https.onRequest((req, res) => {
  // Use cors middleware
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(403).send('Forbidden!');
    }

    const email = req.body.email;

    // Check if the email exists in the Firestore collection
    admin.firestore().collection('paidUsers').doc(email).get()
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
