import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../lib/firebase";

type HistoryItem = {
  id: string;
  category: string;
  topic: string;
  createdAt: string; // 表示用に整形済みの文字列
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.error("ユーザーがログインしていません。");
        return;
      }

      try {
        const q = query(
          collection(db, "topics_history"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            category: d.category || "不明",
            topic: d.topic || "不明",
            createdAt: d.createdAt?.toDate().toLocaleString() || "不明",
          };
        });
        setHistory(data);
      } catch (error) {
        console.error("履歴の取得中にエラーが発生しました:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>出題履歴</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem", backgroundColor: "#f9f9f9" }}>
              日時
            </th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem", backgroundColor: "#f9f9f9" }}>
              カテゴリ
            </th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem", backgroundColor: "#f9f9f9" }}>
              議題
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{item.createdAt}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{item.category}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{item.topic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}