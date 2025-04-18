import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getRandomTopic, getAllCategories } from "./data/utils/getRandomTopic";
import { TopicCategory, topics } from "./data/topics"; // topicsをインポート
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ユーザー認証用

export default function RoomPage() {
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | "">("");
  const [topic, setTopic] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [participantName, setParticipantName] = useState(""); // 参加者名
  const [participants, setParticipants] = useState<string[]>([]); // 参加者リスト
  const [userName, setUserName] = useState("匿名"); // ユーザー名
  const [timeLimit, setTimeLimit] = useState(15); // 15分が初期値
  const [createdRoomId, setCreatedRoomId] = useState(""); // 作成したルームID
  const [joinRoomId, setJoinRoomId] = useState(""); // 参加するルームID
  const router = useRouter();

  // Firestoreから履歴を取得
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(collection(db, "topicHistory"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data());
        setHistory(data);
      } catch (error) {
        console.error("履歴の取得中にエラーが発生しました:", error);
      }
    };
    fetchHistory();
  }, []);

  // 議題を生成
  const handleGenerate = async () => {
    try {
      const newTopic =
        selectedCategory === "" ? getRandomTopic() : getRandomTopic(selectedCategory);
      setTopic(newTopic);

      // Firestoreに議題履歴を保存
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user ? user.uid : "guest";

      await addDoc(collection(db, "topicHistory"), {
        uid,
        category: selectedCategory || "all",
        topic: newTopic,
        createdAt: serverTimestamp(),
      });

      // 履歴を再取得
      const q = query(collection(db, "topicHistory"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setHistory(data);
    } catch (error) {
      console.error("Firestoreへの保存エラー:", error);
    }
  };

  // 参加者を追加
  const addParticipant = () => {
    if (
      participantName.trim() &&
      participants.length < 4 &&
      !participants.includes(participantName.trim())
    ) {
      setParticipants([...participants, participantName.trim()]);
      setParticipantName("");
    }
  };

  // ランダムなルームIDを生成
  const generateRandomRoomId = () => {
    return Math.random().toString(36).substring(2, 8); // ランダムな6桁の英数字
  };

  // ルームを作成
  const handleCreateRoom = async () => {
    const auth = getAuth(); // ユーザー認証情報を取得
    const user = auth.currentUser;
    if (!user) {
      alert("ログインが必要です");
      return;
    }

    try {
      const roomId = generateRandomRoomId(); // ランダムなルームIDを生成
      const topicIndex = Math.floor(Math.random() * topics.length); // ランダムな議題を選択
      const selectedTopic = topics[topicIndex];

      await setDoc(doc(db, "rooms", roomId), {
        host: user.displayName || "匿名", // ホスト名
        hostId: user.uid, // ホストのUIDを保存
        participants: [user.displayName || "匿名"], // 参加者リストにホストを追加
        settings: {
          topic: topic, // settings の中に議題を保存
          timeLimit: timeLimit, // settings の中に制限時間を保存
        },
        createdAt: serverTimestamp(),
      });

      // 履歴保存処理
      await addDoc(collection(db, "topics_history"), {
        userId: user.uid,
        topic: topic || "不明",
        category: selectedCategory || "不明",
        createdAt: new Date(),
      });

      setCreatedRoomId(roomId); // 作成したルームIDを保存
      alert("ルームが作成されました！");
      router.push(`/call?roomId=${roomId}`); // call.tsx への遷移
    } catch (error) {
      console.error("ルーム作成中にエラーが発生しました:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>議題出題ページ</h1>

      {/* カテゴリ選択 */}
      <label>カテゴリ選択：</label>
      <select
        value={selectedCategory}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSelectedCategory(e.target.value as TopicCategory)
        }
      >
        <option value="">全体からランダム</option>
        {getAllCategories().map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <br />
      <button onClick={handleGenerate} style={{ marginTop: "2rem" }}>
        議題を出す
      </button>

      {/* 出題された議題 */}
      {topic && (
        <div style={{ marginTop: "2rem", fontSize: "1.1rem" }}>
          出題された議題：<br />
          {topic}
        </div>
      )}

      {/* 制限時間を選ぶセレクトボックス */}
      <div style={{ marginTop: "2rem" }}>
        <label>制限時間を選択：</label>
        <select
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          style={{ marginLeft: "1rem", padding: "0.5rem" }}
        >
          {[...Array(10)].map((_, i) => {
            const minutes = 15 + i * 5; // 15, 20, ..., 60
            return (
              <option key={minutes} value={minutes}>
                {minutes}分
              </option>
            );
          })}
        </select>
      </div>

      {/* 参加者表示機能 */}
      <div style={{ marginTop: "2rem" }}>
        <h2>参加者（最大4人）</h2>
        <input
          type="text"
          placeholder="参加者名を入力"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
        />
        <button onClick={addParticipant} disabled={participants.length >= 4}>
          追加
        </button>

        <ul style={{ marginTop: "1rem" }}>
          {participants.map((name, index) => (
            <li key={index}>・{name}</li>
          ))}
        </ul>
      </div>

      {/* ルーム作成ボタン */}
      <button
        onClick={handleCreateRoom}
        style={{
          marginTop: "2rem",
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ルームを作成
      </button>

      {/* 作成したルームIDを表示 */}
      {createdRoomId && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            ルームID：<strong>{createdRoomId}</strong>
          </p>
          <p>このIDを他のユーザーに共有してください</p>
        </div>
      )}

      {/* 既存ルームに参加する機能 */}
      <div style={{ marginTop: "2rem" }}>
        <h3>既存ルームに参加する</h3>
        <input
          type="text"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          placeholder="ルームIDを入力"
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <button
          onClick={() => router.push(`/call?roomId=${joinRoomId}`)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          参加する
        </button>
      </div>

      {/* 出題履歴を表示 */}
      {history.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>出題履歴</h2>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                [{item.category}] {item.topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}