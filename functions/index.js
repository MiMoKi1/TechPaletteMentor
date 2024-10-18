const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp();

const corsOptions = {
  origin: 'https://mimoki1.github.io', // Specify your allowed origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

exports.checkPaidUsers = functions.https.onRequest((req, res) => {
  cors(corsOptions)(req, res, async () => {
    // Your existing logic for checking paid users
    const email = req.body.email;
    
    try {
      const snapshot = await admin.firestore().collection('paidUsers').where('email', '==', email).get();
      if (snapshot.empty) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User is a paid user' });
    } catch (error) {
      return res.status(500).json({ message: 'Error checking user access', error: error.message });
    }
  });
});
