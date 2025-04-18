import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestoreの関数をインポート
import { getAuth } from "firebase/auth";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [gender, setGender] = useState("");
  const [grade, setGrade] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [desiredJob, setDesiredJob] = useState("");

  // Firestoreからプロフィールデータを取得
  useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setUniversity(data.university || "");
        setGender(data.gender || "");
        setGrade(data.grade || "");
        setGraduationYear(data.graduationYear || "");
        setDesiredJob(data.desiredJob || "");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("ログインしていません");
      return;
    }

    try {
      // Firestoreにデータを保存
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        university,
        gender,
        grade,
        graduationYear,
        desiredJob,
        email: user.email,
        createdAt: new Date(),
      });
      alert("プロフィールを保存しました！");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-center text-lg font-semibold mb-6">プロフィール登録</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">お名前</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">所属大学</span>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">学年</span>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">卒業予定年度</span>
            <input
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="例：2026"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">希望業界</span>
            <input
              type="text"
              value={desiredJob}
              onChange={(e) => setDesiredJob(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-black font-medium py-2 rounded"
          >
            保存する
          </button>
        </form>
      </div>
    </div>
  );
}