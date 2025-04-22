'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (session?.user?.email) {
        const docRef = doc(db, "users", session.user.email);
        const docSnap = await getDoc(docRef);
        setHasProfile(docSnap.exists());
      }
      setIsLoading(false);
    };

    if (status === "authenticated") {
      checkProfile();
    } else {
      setIsLoading(false);
    }
  }, [status, session]);

  const handleGoogleLogin = () => {
    signIn('google'); // NextAuth 統一
  };

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">グルディスオンライン</h1>
        <p className="text-gray-600 mb-6 text-sm">
          全国各地の就活生と切磋琢磨しよう<br />
          ライバル、仲間を見つけよう
        </p>

        {/* ログイン状態で分岐 */}
        {session ? (
          hasProfile ? (
            <button
              onClick={() => router.push('/room')}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded mb-4"
            >
              グルディスを行う
              </button>
          ) : (
            <button
              onClick={() => router.push('/profile')}
              className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded mb-4"
            >
              プロフィール登録へ
            </button>
          )
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4"
          >
            Googleでログイン
          </button>
        )}

        {/* 利用規約へのボタン */}
        <Link href="/terms">
          <button className="mt-2 text-sm text-gray-600 underline hover:text-gray-800">
            利用規約を読む
          </button>
        </Link>
      </div>
    </div>
  );
}