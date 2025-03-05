import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBG_BYMrlQlhDse2xs7gofi36AURH0aJ1U",
  authDomain: "zippy-ai-46404.firebaseapp.com",
  projectId: "zippy-ai-46404",
  storageBucket: "zippy-ai-46404.firebasestorage.app",
  messagingSenderId: "901484456293",
  appId: "1:901484456293:web:11df7540a7d874e147998c",
  measurementId: "G-BHW0TRC376"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);