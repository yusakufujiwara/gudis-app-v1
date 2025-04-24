'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (session?.user?.email) {
        const docRef = doc(db, "users", session.user.email);
        const docSnap = await getDoc(docRef);
        setHasProfile(docSnap.exists());
      }
      setIsChecking(false);
    };

    if (status === "authenticated") {
      checkProfile();
    } else {
      setIsChecking(false);
    }
  }, [status, session]);

  const handleGoogleLogin = () => {
    signIn('google');
  };

  if (status === "loading" || isChecking) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Gudis Online</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Gudis Onlineは、就活生がオンラインでグループディスカッション（グルディス）の練習を行うためのプラットフォームです。
          ルームマッチング・タイマー・評価機能を通じて、仲間と切磋琢磨しながらスキルアップできます。
        </p>
{/* ログイン状態で分岐 */}
{status === "unauthenticated" ? (
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4"
          >
            Googleでログイン
          </button>
        ) : hasProfile ? (
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
        )}

        {/* 利用規約 & プライバシーポリシー */}
        <div className="flex flex-col space-y-1 mt-2">
          <Link href="/terms">
            <a className="text-sm text-gray-600 underline hover:text-gray-800">
              利用規約を読む
              </a>
          </Link>
          <Link href="/privacy">
            <a className="text-sm text-gray-600 underline hover:text-gray-800">
              プライバシーポリシーを読む
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}