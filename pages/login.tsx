import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [gender, setGender] = useState('');
  const [grade, setGrade] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [jobType, setJobType] = useState('');

// ログイン状態に応じてリダイレクト
useEffect(() => {
  if (status === 'authenticated') {
    router.push('/profile'); // ログイン後にプロフィールページへ
  }
}, [status, router]);

const handleSubmit = async () => {
  if (!session?.user?.email) {
    alert("ログインしていません");
    return;
  }

  try {
    await setDoc(doc(db, "users", session.user.email), {
      name,
      university,
      gender,
      grade,
      graduationYear,
      jobType,
      email: session.user.email,
    });
    alert("プロフィールを保存しました！");
  } catch (error) {
    console.error("保存エラー:", error);
    alert("保存に失敗しました");
  }
};

return (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    {session ? (
      <>
        <p>ログイン中：{session.user?.name}</p>
        <p>メール：{session.user?.email}</p>
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
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            ログアウト
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn('google')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Googleでログイン
        </button>
      )}
    </div>
  );
}
