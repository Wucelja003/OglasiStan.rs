// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "oglasistan-4ee7c.firebaseapp.com",
  projectId: "oglasistan-4ee7c",
  storageBucket: "oglasistan-4ee7c.firebasestorage.app",
  messagingSenderId: "40651804176",
  appId: "1:40651804176:web:71b43e66117e53724b0495",
  measurementId: "G-P1EMYD3S77"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);