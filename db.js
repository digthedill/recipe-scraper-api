const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: process.env.FIRESTORE_AUTHDOMAIN,
  projectId: process.env.FIRESTORE_PROJECT_ID,
  storageBucket: "recipescraper-bedd0.appspot.com",
  messagingSenderId: "534267665700",
  appId: "1:534267665700:web:5300b1d0545d12c11d67b1",
  measurementId: "G-LFD7QVPHNS",
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

module.exports = db;
