// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { FIREBASE_API_KEY } from "@env"

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "diabetes-app-4bd19.firebaseapp.com",
  databaseURL: "https://diabetes-app-4bd19-default-rtdb.firebaseio.com",
  projectId: "diabetes-app-4bd19",
  storageBucket: "diabetes-app-4bd19.appspot.com",
  messagingSenderId: "834385131075",
  appId: "1:834385131075:web:42efbb625388c955ce46f6",
  measurementId: "G-Y0DW2C8F25"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
