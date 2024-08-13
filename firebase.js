// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx1md2HqXv_4WiG-TM3QE3I6qjyFFkxg4",
  authDomain: "inventory-76127.firebaseapp.com",
  projectId: "inventory-76127",
  storageBucket: "inventory-76127.appspot.com",
  messagingSenderId: "336952418377",
  appId: "1:336952418377:web:1385ad0203a50efec59f98",
  measurementId: "G-Z508RK5D6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
