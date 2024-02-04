// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, setPersistence,browserSessionPersistence } from 'firebase/auth'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhQ-ZU2HH0LrJkafh1KjeExo8W2K_2dO0",
  authDomain: "projecttic-df3d3.firebaseapp.com",
  projectId: "projecttic-df3d3",
  storageBucket: "projecttic-df3d3.appspot.com",
  messagingSenderId: "537098858888",
  appId: "1:537098858888:web:92bd505550af4f5f2a4a3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth()
//setPersistence(auth, browserSessionPersistence)

export { app, auth,onAuthStateChanged }
