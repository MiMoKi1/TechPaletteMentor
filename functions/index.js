const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true }); // Allow requests from your app's domain

admin.initializeApp();

exports.checkPaidUsers = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const email = request.body.email;

    // Replace this logic with your actual check against the database
    const paidUsers = ["user@example.com"]; // Example static list

    if (paidUsers.includes(email)) {
      response.send({ accessGranted: true });
    } else {
      response.send({ accessGranted: false });
    }
  });
});
