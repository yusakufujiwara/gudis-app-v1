import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../lib/firebase"; // パスは環境に合わせて

const JoinRoomPage = () => {
  const router = useRouter();
  const auth = getAuth();
  const [roomId, setRoomId] = useState(""); // 入力されたルームID
  const [error, setError] = useState(""); // エラーメッセージ

  const handleJoin = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("ログインが必要です");
      return;
    }

    try {
      const roomRef = doc(db, "rooms", roomId); // Firestoreのルーム参照
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        setError("ルームが見つかりません");
        return;
      }

      // ルームに参加者を追加
      await updateDoc(roomRef, {
        members: arrayUnion({
          uid: user.uid,
          name: user.displayName || "匿名", // ユーザー名を追加
        }),
      });

      // ルームに参加後、通話画面に遷移
      router.push(`/call?roomId=${roomId}`);
    } catch (error) {
      console.error("ルーム参加中にエラーが発生しました:", error);
      setError("ルーム参加に失敗しました");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ルームに参加</h1>
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="ルームコードを入力"
        style={{
          padding: "0.5rem",
          marginRight: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <button
        onClick={handleJoin}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        参加
      </button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default JoinRoomPage;