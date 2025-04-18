import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import { collection, doc, writeBatch, serverTimestamp, getDoc, addDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function EvaluatePage() {
  const router = useRouter();
  const [others, setOthers] = useState<string[]>([]); // 他の参加者
  const [evaluations, setEvaluations] = useState<any[]>([]); // 詳細評価データ
  const [scores, setScores] = useState<Record<string, number>>({}); // 簡易評価データ
  const [userName, setUserName] = useState(""); // Firestoreから取得したユーザー名
  const [participants, setParticipants] = useState<any[]>([]); // 参加者リスト

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

  // 他の参加者を取得
  useEffect(() => {
    if (router.query.participants) {
      const all = JSON.parse(router.query.participants as string);
      const filtered = all.filter((name: string) => name !== userName); // 自分以外をフィルタリング
      setOthers(filtered);

      // 初期評価データを設定
      const initialEvaluations = filtered.map((name: string) => ({
        name,
        logic: 3,
        speaking: 3,
        cooperation: 3,
        comment: "",
      }));
      setEvaluations(initialEvaluations);
    }
  }, [router.query, userName]);

  // 参加者リストを取得
  useEffect(() => {
    if (router.query.participants) {
      const parsed = JSON.parse(router.query.participants as string);
      setParticipants(parsed);
    }
  }, [router.query.participants]);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...evaluations];
    (updated[index] as any)[field] = value;
    setEvaluations(updated);
  };

  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    try {
      // 詳細評価の保存
      const batch = writeBatch(db);
      evaluations.forEach((evalData) => {
        const docRef = doc(collection(db, "evaluations"));
        batch.set(docRef, {
          ...evalData,
          evaluator: user.displayName || "匿名",
          createdAt: serverTimestamp(),
        });
      });

      // 簡易評価の保存
      for (const [targetName, score] of Object.entries(scores)) {
        const docRef = doc(collection(db, "evaluations"));
        await setDoc(docRef, {
          evaluator: user.displayName || "匿名",
          target: targetName,
          score,
          createdAt: serverTimestamp(),
        });
      }

      await batch.commit(); // 詳細評価を一括保存

      alert("評価を送信しました！");
      router.push("/"); // ホーム画面にリダイレクト
    } catch (error) {
      console.error("評価保存エラー:", error);
      alert("保存中にエラーが発生しました");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>他の参加者を評価</h1>

      {/* 詳細評価 */}
      {others.map((name, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            margin: "1rem 0",
            borderRadius: "8px",
          }}
        >
          <h2>{name} さんを評価</h2>
          <label>
            論理性：
            <input
              type="number"
              min="1"
              max="5"
              value={evaluations[index]?.logic || 3}
              onChange={(e) => handleChange(index, "logic", Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            話し方：
            <input
              type="number"
              min="1"
              max="5"
              value={evaluations[index]?.speaking || 3}
              onChange={(e) => handleChange(index, "speaking", Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            協調性：
            <input
              type="number"
              min="1"
              max="5"
              value={evaluations[index]?.cooperation || 3}
              onChange={(e) => handleChange(index, "cooperation", Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            コメント：
            <textarea
              value={evaluations[index]?.comment || ""}
              onChange={(e) => handleChange(index, "comment", e.target.value)}
              style={{ width: "100%", height: "4rem" }}
            />
          </label>
        </div>
      ))}

      {/* 簡易評価 */}
      <h2>全参加者の簡易評価</h2>
      {participants.map((p, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <h3>{p.name}さんを評価</h3>
          <select
            value={scores[p.name] || ""}
            onChange={(e) =>
              setScores((prev) => ({
                ...prev,
                [p.name]: parseInt(e.target.value),
              }))
            }
          >
            <option value="">選択してください</option>
            <option value={5}>とても良い</option>
            <option value={3}>普通</option>
            <option value={1}>改善が必要</option>
          </select>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        評価を送信
      </button>
    </div>
  );
}