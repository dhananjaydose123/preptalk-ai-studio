import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxJAoER130YXE0o0OSZv13Ti3JcZIj4II",
  authDomain: "preptalk-ai-1d79f.firebaseapp.com",
  projectId: "preptalk-ai-1d79f",
  storageBucket: "preptalk-ai-1d79f.firebasestorage.app",
  messagingSenderId: "840866536761",
  appId: "1:840866536761:web:9ccdb55974aa650c919ce8",
  measurementId: "G-Z1PBJ60HCW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
