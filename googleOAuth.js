// googleOAuth.js
const CLIENT_ID = '1031883252330-j3vht1ianq6850l0p78mv3nu2t1f4ks3.apps.googleusercontent.com'; // Your actual Client ID
const SCOPES = 'https://www.googleapis.com/auth/userinfo.email';
const REDIRECT_URI = 'https://techpalettementorback.herokuapp.com/callback'; // Heroku redirect URI

// Load the API client and auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        // Check if the user is already signed in
        if (authInstance.isSignedIn.get()) {
            console.log('User is already signed in');
            checkUserPayment(authInstance); // Check payment status if signed in
        } else {
            // User is not signed in, trigger login
            authInstance.signIn().then(() => {
                console.log('User signed in');
                checkUserPayment(authInstance); // Check payment status after signing in
            });
        }
    }).catch(error => {
        console.error('Error during Google API initialization:', error);
    });
}

// Check if the user has paid after verifying their Google login
function checkUserPayment(authInstance) {
    const userProfile = authInstance.currentUser.get();
    const userId = userProfile.getId(); // Get the user's Google ID

    // Fetch from your Heroku backend to check if the user has paid
    fetch(`https://techpalettementorback.herokuapp.com/check-payment/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.hasPaid) {
                console.log('User has paid. Grant access to the app.');
                loadAppFeatures(); // Load app features if the user has paid
            } else {
                console.error('User has not paid. Access denied.');
                alert('Access denied. Please purchase access to the app.');
                authInstance.signOut(); // Sign out if the user has not paid
            }
        })
        .catch(error => {
            console.error('Error checking payment status:', error);
        });
}

// Function to load app features for paid users
function loadAppFeatures() {
    console.log('Loading app features...');
    // Logic to display app features goes here
}

// Initialize Google Authentication
document.addEventListener('DOMContentLoaded', handleClientLoad);
