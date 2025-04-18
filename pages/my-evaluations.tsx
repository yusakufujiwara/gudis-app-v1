import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";

export default function MyEvaluationsPage() {
  const [myName, setMyName] = useState(""); // ログイン中のユーザー名
  const [userName, setUserName] = useState(""); // Firestoreから取得したユーザー名
  const [myEvaluations, setMyEvaluations] = useState<any[]>([]); // ユーザーへの評価データ
  const [selectedCategory, setSelectedCategory] = useState<"" | "logic" | "speaking" | "cooperation">(""); // カテゴリ選択用の状態

  useEffect(() => {
    const fetchMyEvaluations = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("ログインが必要です");
        return;
      }

      const displayName = user.displayName || ""; // ユーザー名を取得
      setMyName(displayName);

      // Firestoreからユーザーに対する評価データを取得（新しい順に並べる）
      const q = query(
        collection(db, "evaluations"),
        where("name", "==", displayName),
        orderBy("createdAt", "desc") // ★ 新しい順に並べる
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setMyEvaluations(data);
    };

    fetchMyEvaluations();
  }, []);

  // Firestoreからログイン中のユーザー名を取得
  useEffect(() => {
    const fetchUserName = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const userData = snap.data();
          setUserName(userData.name); // Firestoreから取得した名前を設定
        }
      } catch (error) {
        console.error("ユーザー名の取得中にエラーが発生しました:", error);
      }
    };

    fetchUserName();
  }, []);

  // 平均値の計算
  const averageScore = () => {
    if (selectedCategory === "") return null;

    const scores = myEvaluations
      .map((e) => e[selectedCategory])
      .filter((score) => typeof score === "number");

    if (scores.length === 0) return null;

    const total = scores.reduce((sum, score) => sum + score, 0);
    return (total / scores.length).toFixed(2);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{myName} さんへの評価一覧</h1>

      {/* カテゴリ選択 */}
      <label>カテゴリ選択：</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value as "" | "logic" | "speaking" | "cooperation")}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      >
        <option value="">すべて</option>
        <option value="logic">論理性</option>
        <option value="speaking">話し方</option>
        <option value="cooperation">協調性</option>
      </select>

      {/* 平均点の表示 */}
      {selectedCategory !== "" && averageScore() !== null && (
        <p>
          <strong>{selectedCategory}の平均点:</strong> {averageScore()}
        </p>
      )}

      {myEvaluations.length === 0 ? (
        <p>まだ評価がありません。</p>
      ) : (
        myEvaluations
          .slice() // 元の配列を壊さないようにコピー
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate?.() ?? new Date(0);
            const bDate = b.createdAt?.toDate?.() ?? new Date(0);
            return bDate.getTime() - aDate.getTime(); // 新しい順
          })
          .filter((e) => {
            if (selectedCategory === "") return true; // カテゴリが選択されていない場合はすべて表示
            return typeof e[selectedCategory] === "number"; // 選択されたカテゴリが数値の場合のみ表示
          })
          .map((e, index) => (
            <div key={index} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #ccc" }}>
              {selectedCategory === "" || selectedCategory === "logic" ? (
                <p>
                  <strong>論理性:</strong> {e.logic ?? "N/A"}
                </p>
              ) : null}
              {selectedCategory === "" || selectedCategory === "speaking" ? (
                <p>
                  <strong>話し方:</strong> {e.speaking ?? "N/A"}
                </p>
              ) : null}
              {selectedCategory === "" || selectedCategory === "cooperation" ? (
                <p>
                  <strong>協調性:</strong> {e.cooperation ?? "N/A"}
                </p>
              ) : null}
              <p>
                <strong>コメント：</strong> {e.comment ?? "N/A"}
              </p>
              <hr />
            </div>
          ))
      )}
    </div>
  );
}