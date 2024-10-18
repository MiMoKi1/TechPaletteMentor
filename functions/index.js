const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.checkPaidUser = functions.https.onCall(async (data, context) => {
    const userEmail = data.email;

    try {
        const userDoc = await db.collection('paidUsers').doc(userEmail).get();
        if (userDoc.exists) {
            return { accessGranted: true };
        } else {
            return { accessGranted: false };
        }
    } catch (error) {
        console.error('Error checking user:', error);
        throw new functions.https.HttpsError('internal', 'Error checking user');
    }
});
