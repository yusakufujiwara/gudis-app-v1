import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // パスは環境に合わせて
import { topics } from "../data/topics"; // 議題データをインポート

const CreateRoomPage = () => {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [isCreating, setIsCreating] = useState(false);
  const [userName, setUserName] = useState(""); // Firestoreから取得したユーザー名

  // Firestoreからログイン中のユーザー名を取得
  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const userData = snap.data();
          setUserName(userData.name || "匿名"); // Firestoreから取得した名前を設定
        }
      } catch (error) {
        console.error("ユーザー名の取得中にエラーが発生しました:", error);
      }
    };

    fetchUserName();
  }, [user]);

  const generateRoomId = () => {
    // 6桁のランダムな英数字
    return Math.random().toString(36).substring(2, 8);
  };

  const createRoom = async () => {
    if (!user) {
      alert("ログインが必要です");
      return;
    }

    setIsCreating(true);
    const roomId = generateRoomId();

    // ランダムな議題を選択
    const topicIndex = Math.floor(Math.random() * topics.length);
    const selectedTopic = topics[topicIndex];

    const roomData = {
      roomId: roomId,
      hostId: user.uid,
      hostName: userName || "匿名", // ホスト名
      members: [
        {
          uid: user.uid,
          name: userName || "匿名",
        },
      ],
      topic: selectedTopic, // ランダムに選択された議題
      topicIndex: topicIndex,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "rooms", roomId), roomData); // Firestoreにルームデータを保存
      alert("ルームが作成されました！");
      router.push(`/call?roomId=${roomId}`); // call.tsx への遷移
    } catch (error) {
      console.error("ルーム作成中にエラーが発生しました:", error);
      alert("ルーム作成に失敗しました");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ルーム作成</h1>
      <button onClick={createRoom} disabled={isCreating}>
        {isCreating ? "作成中..." : "ルームを作成"}
      </button>
    </div>
  );
};

export default CreateRoomPage;