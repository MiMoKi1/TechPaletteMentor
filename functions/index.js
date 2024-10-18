const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true }); // Allow all origins

admin.initializeApp();

exports.checkPaidUsers = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const email = request.body.email;

    // Replace this logic with your actual check against the database
    const paidUsers = ["user@example.com"]; // Example static list

    // Logic to check if the user has paid (update this with your actual database check)
    if (paidUsers.includes(email)) {
      response.send({ accessGranted: true });
    } else {
      response.send({ accessGranted: false });
    }
  });
});
