const firebase = require('firebase');
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBd0btetpDUQXoJPhfXMdd1rrcpJeE39_8",
  authDomain: "note-api-f3d9d.firebaseapp.com",
  projectId: "note-api-f3d9d",
  storageBucket: "note-api-f3d9d.appspot.com",
  messagingSenderId: "324603973802",
  appId: "1:324603973802:web:26067c0a7ccf5e690680d3",
  measurementId: "G-E9M9TWD156"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig); //initialize firebase app 
module.exports = { firebase }; //export the app