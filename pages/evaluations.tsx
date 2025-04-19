import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../lib/firebase";

type Evaluation = {
  evaluator: string;
  target?: string;
  score?: number;
  logic?: number;
  speaking?: number;
  cooperation?: number;
  comment?: string;
  createdAt?: { toDate: () => Date }; // Firestore Timestamp型
  [key: string]: any; // その他のプロパティを許可
};

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]); // 評価データ
  const [searchName, setSearchName] = useState(""); // 名前検索用の状態
  const [filterField, setFilterField] = useState<keyof Evaluation | "">("");
  const [filterScore, setFilterScore] = useState<string>(""); // フィルタリングするスコア
  const [userName, setUserName] = useState(""); // Firestoreから取得したユーザー名
  const [logic, setLogic] = useState(0); // 論理性スコア
  const [speaking, setSpeaking] = useState(0); // 話し方スコア
  const [cooperation, setCooperation] = useState(0); // 協調性スコア
  const [comment, setComment] = useState(""); // コメント

  // Firestoreから評価データを取得
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const q = query(collection(db, "evaluations"), orderBy("createdAt", "desc")); // 降順で取得
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data() as Evaluation);
        setEvaluations(data);
      } catch (error) {
        console.error("評価データの取得中にエラーが発生しました:", error);
      }
    };

    fetchEvaluations();
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

  const handleSubmit = async () => {
    if (!userName || logic === 0 || speaking === 0 || cooperation === 0) {
      alert("すべての項目を入力してください。");
      return;
    }

    try {
      await addDoc(collection(db, "evaluations"), {
        evaluator: userName, // Firestoreから取得した名前を使用
        logic,
        speaking,
        cooperation,
        comment,
        createdAt: serverTimestamp(),
      });
      alert("評価が保存されました！");
      setLogic(0);
      setSpeaking(0);
      setCooperation(0);
      setComment("");
    } catch (error) {
      console.error("評価の保存中にエラーが発生しました:", error);
    }
  };

  // 名前と評価項目・スコアでフィルタリング
const filteredEvaluations = evaluations
.filter((e: Evaluation) =>
  searchName === "" || (e.evaluator && e.evaluator.toLowerCase().includes(searchName.toLowerCase()))
)
.filter((e: Evaluation) => {
  if (!filterField || !(filterField in e)) return true;
  return String((e as Record<string, any>)[filterField]) === filterScore;
});

  // 各評価項目の平均スコアを計算する関数
  const getAverage = (field: keyof Evaluation): number => {
    const validScores = evaluations
      .map((e) => e[field])
      .filter((value) => typeof value === "number") as number[];
    if (validScores.length === 0) return 0;
    const total = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round((total / validScores.length) * 10) / 10; // 小数点1桁で丸める
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>評価一覧</h1>

      {/* 全体の平均スコア */}
      <div style={{ marginBottom: "2rem" }}>
        <h2>全体の平均スコア</h2>
        <p>論理性：{getAverage("logic")}</p>
        <p>話し方：{getAverage("speaking")}</p>
        <p>協調性：{getAverage("cooperation")}</p>
      </div>

      {/* 名前検索入力欄 */}
      <input
        type="text"
        placeholder="名前で検索"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        style={{ margin: "1rem 0", padding: "0.5rem", width: "200px" }}
      />

      {/* 評価項目とスコアのフィルタリング */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          評価項目：
          <select value={filterField} onChange={(e) => setFilterField(e.target.value as keyof Evaluation)}>
            <option value="">-- 選択 --</option>
            <option value="logic">論理性</option>
            <option value="speaking">話し方</option>
            <option value="cooperation">協調性</option>
          </select>
        </label>

        <label style={{ marginLeft: "1rem" }}>
          スコア：
          <select value={filterScore} onChange={(e) => setFilterScore(e.target.value)}>
            <option value="">--</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </label>
      </div>

      {/* フィルタリング結果の表示 */}
      {filteredEvaluations.length === 0 ? (
        <p>該当する評価データがありません。</p>
      ) : (
        filteredEvaluations.map((e, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #ccc",
              marginBottom: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <p>
              <strong>評価者：</strong>
              {e.evaluator}
            </p>
            <p>
              <strong>対象者：</strong>
              {e.target}
            </p>
            <p>
              <strong>スコア：</strong>
              {e.score}
            </p>
            <p>
              <strong>投稿日：</strong>
              {e.createdAt?.toDate?.().toLocaleString() ?? "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}