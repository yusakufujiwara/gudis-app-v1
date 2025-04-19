import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // ← 追加

const firebaseConfig = {
  apiKey: "AIzaSyCLvnwSVwUi3dUTu3HIUyU4upkY2N_6NiY",
  authDomain: "gudis-app-v1.vercel.app",
  projectId: "gudis-app",
  storageBucket: "gudis-app.appspot.com",
  messagingSenderId: "145573130822",
  appId: "1:145573130822:web:xxxxxxxxxxxxxx",
  measurementId: "G-V4X16Q4EFW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // ← 追加

// Googleログイン関数
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Googleログインエラー:", error);
    throw error;
  }
};

export default app;
export { db, auth }; // ← authもexport