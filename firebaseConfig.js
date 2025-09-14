// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWsFAsN7keRXS0axPL84MkyVXrcw0B2QA",
  authDomain: "community-app-33596.firebaseapp.com",
  projectId: "community-app-33596",
//   storageBucket: "community-app-33596.firebasestorage.app",
  storageBucket: "community-app-33596.appspot.com",
  messagingSenderId: "483558689899",
  appId: "1:483558689899:android:c7cbd138d665293e7a752e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
