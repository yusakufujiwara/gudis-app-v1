import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [showTerms, setShowTerms] = useState(false); // 利用規約モーダルの状態
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Firestoreからプロフィールの有無を確認
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      console.log("ログイン成功");
      alert("ログインに成功しました！");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        alert("ログインがキャンセルされました。もう一度お試しください。");
      } else {
        console.error("ログインエラー:", error);
        alert("ログインに失敗しました。");
      }
    }
  };

  const buttonStyle = {
    padding: "0.75rem 2rem",
    marginTop: "1rem",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        {/* 題名と文言は常に表示 */}
        <h1 className="text-2xl font-bold mb-2">グルディスオンライン</h1>
        <p className="text-gray-600 mb-6 text-sm">
          全国各地の就活生と切磋琢磨しよう<br />
          ライバル、仲間を見つけよう
        </p>

        {/* ログイン状態に応じたボタン表示 */}
        {!user ? (
          <button
            className="bg-gray-200 text-black font-semibold py-2 px-4 rounded mb-4 w-full"
            onClick={handleGoogleLogin}
          >
            Googleログイン
          </button>
        ) : (
          <>
            {hasProfile ? (
              <button onClick={() => router.push("/room")} style={buttonStyle}>
                グルディスを行う
              </button>
            ) : (
              <button onClick={() => router.push("/profile")} style={buttonStyle}>
                プロフィール登録へ
              </button>
            )}
          </>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setShowTerms(true)}
            className="text-sm text-blue-500 underline"
          >
            利用規約を見る
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">＊ログインで利用規約に同意</p>
      </div>

      {/* 利用規約モーダル */}
      {showTerms && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "90%",
              maxHeight: "80%",
              overflowY: "auto",
            }}
          >
            <h2>利用規約</h2>
            <p style={{ textAlign: "left", whiteSpace: "pre-line" }}>
              【グルディスオンライン 利用規約】{"\n\n"}
              1. 本サービスは、就活生のグループディスカッション練習を支援する目的で提供されます。{"\n"}
              2. ユーザーはGoogleアカウントでログインすることでサービスを利用できます。{"\n"}
              3. 本サービスを通じて収集される情報（名前、評価データ等）は、サービス改善以外の目的では使用しません。{"\n"}
              4. 不適切な言動・利用があった場合、運営は該当ユーザーの利用を制限することがあります。{"\n"}
              5. 本サービスは予告なく変更・終了する場合があります。{"\n\n"}
              ＊サービスを利用することで、上記の規約に同意したものとみなされます。
            </p>
            <button
              onClick={() => setShowTerms(false)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}