import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration

export const firebaseConfig = {
  apiKey: "AIzaSyAOxPTh8p5Tpf7jDQbN74KvL95AeFL8bWE",
  authDomain: "eshop-6e4a9.firebaseapp.com",
  projectId: "eshop-6e4a9",
  storageBucket: "eshop-6e4a9.appspot.com",
  messagingSenderId: "24699082734",
  appId: "1:24699082734:web:10fcd657c9469f89a420ff",
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
