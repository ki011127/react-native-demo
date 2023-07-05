import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import "firebase/firestore";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmVzMfZduOqlTXJlchKF0JJW_dtWLHKDE",
  authDomain: "simpleapp-59f5e.firebaseapp.com",
  projectId: "simpleapp-59f5e",
  storageBucket: "simpleapp-59f5e.appspot.com",
  messagingSenderId: "865169032142",
  appId: "1:865169032142:web:6415811a59d38d06e8619f",
  measurementId: "G-GRTKJX5PKV"
};

const app = initializeApp(firebaseConfig);
export default app;
export const dbService = initializeFirestore(app,{
  experimentalForceLongPolling: true
});