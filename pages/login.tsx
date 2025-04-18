
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db } from "../lib/firebase"; // Firestoreのインポート
import { doc, setDoc } from "firebase/firestore"; // Firestoreの関数をインポート
import app from '../lib/firebase';

export default function LoginPage() {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [gender, setGender] = useState('');
  const [grade, setGrade] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [jobType, setJobType] = useState('');

  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        router.push('/profile');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("ログインしていません");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        university,
        gender,
        grade,
        graduationYear,
        jobType,
        email: user.email,
      });
      alert("プロフィールを保存しました！");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      {user ? (
        <>
          <p>ログイン中：{user.displayName}</p>
          <p>メール：{user.email}</p>
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="大学"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="性別"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="学年"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="卒業年"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="希望職種"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            保存
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            ログアウト
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Googleでログイン
        </button>
      )}
    </div>
  );
}