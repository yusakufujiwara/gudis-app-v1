import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getDatabase, ref, onValue, set } from "firebase/database"; // Firebase Realtime Database のインポート

const rtdb = getDatabase(); // Firebase Realtime Database の初期化

export default function CallPage() {
  const router = useRouter();
  const { roomId } = router.query;
  const auth = getAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [selectedTime, setSelectedTime] = useState(15);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [roomTopic, setRoomTopic] = useState<string>("");
  const [minutesText, setMinutesText] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const hasInitialized = useRef(false);

  // カメラ・マイク用の状態と参照
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // WebRTC用の状態と参照
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // カメラとマイクを起動
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("カメラ・マイク取得エラー:", err);
      }
    };

    startCamera();
  }, []);

  // Firestoreからリアルタイムで参加者リスト、ホスト情報、タイマー、議題を取得
  useEffect(() => {
    if (!roomId || typeof roomId !== "string" || !auth.currentUser) {
      console.error("無効なroomIdまたは認証されていないユーザーです");
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();

      setParticipants(data.participants || []);
      setIsHost(data.hostId === auth.currentUser?.uid);

      const topicFromSettings = data.settings?.topic || "";
      setRoomTopic(topicFromSettings);
      setSelectedTopic(topicFromSettings);

      const time = data.settings?.timeLimit || 15;
      if (!hasInitialized.current) {
        setSelectedTime(time);
        hasInitialized.current = true;
      }

      if (typeof data.timeLeft === "number") {
        setTimeLeft(data.timeLeft);
      }

      const latest = data.updatedAt?.toMillis?.() || 0;
      if (latest > lastUpdated) {
        setMinutesText(data.minutesText || "");
        setLastUpdated(latest);
      }
    });

    return () => unsubscribe();
  }, [roomId, auth.currentUser, lastUpdated]);

  // タイマーのカウントダウン処理
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 0) {
          const newTimeLeft = prev - 1;
          if (isHost && roomId && typeof roomId === "string") {
            updateDoc(doc(db, "rooms", roomId), { timeLeft: newTimeLeft });
          }
          return newTimeLeft;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, roomId, isHost]);

  // タイマーが0になったら評価ページに遷移
  useEffect(() => {
    if (timeLeft === 0) {
      router.push({
        pathname: "/evaluate",
        query: {
          participants: JSON.stringify(participants),
        },
      });
    }
  }, [timeLeft, participants]);

  // 非ホスト用の処理: Offerを受け取り、Answerを送信
  useEffect(() => {
    if (!roomId || !localStream) return;

    const offerRef = ref(rtdb, `calls/${roomId}/offer`);
    const answerRef = ref(rtdb, `calls/${roomId}/answer`);

    const unsubscribe = onValue(offerRef, async (snapshot) => {
      const offer = snapshot.val();
      if (!offer || isHost) return;

      peerConnection.current = new RTCPeerConnection();

      // 自分のストリームを追加
      localStream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, localStream);
      });

      // リモートのオファーを設定
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

      // アンサーを作成して設定
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      // Realtime Databaseにアンサーを保存
      await set(answerRef, {
        type: answer.type,
        sdp: answer.sdp,
      });

      console.log("Answerを作成してRealtime Databaseに保存しました");
    });

    return () => unsubscribe();
  }, [roomId, localStream, isHost]);

  // ホスト用の処理: Answerを受け取る
  useEffect(() => {
    if (!roomId || !isHost) return;

    const answerRef = ref(rtdb, `calls/${roomId}/answer`);
    const unsubscribe = onValue(answerRef, async (snapshot) => {
      const answer = snapshot.val();
      if (answer && peerConnection.current) {
        // リモートのアンサーを設定
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Answerを受信して設定しました");
      }
    });

    return () => unsubscribe();
  }, [roomId, isHost]);

  // ICE候補の送信（共通）
  useEffect(() => {
    if (!roomId || !peerConnection.current) return;

    const candidatesRef = ref(rtdb, `calls/${roomId}/candidates/${isHost ? "host" : "guest"}`);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.toJSON();
        set(ref(rtdb, `${candidatesRef.key}/${Date.now()}`), candidate);
      }
    };
  }, [roomId, isHost]);

  // ICE候補の受信（共通）
  useEffect(() => {
    if (!roomId || !peerConnection.current) return;

    const otherSide = isHost ? "guest" : "host";
    const candidatesRef = ref(rtdb, `calls/${roomId}/candidates/${otherSide}`);

    const unsubscribe = onValue(candidatesRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const candidate = new RTCIceCandidate(childSnapshot.val());
        peerConnection.current?.addIceCandidate(candidate);
      });
    });

    return () => unsubscribe();
  }, [roomId, isHost]);

  // リモートストリームの設定
  useEffect(() => {
    if (!peerConnection.current || !remoteVideoRef.current) return;

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  }, [peerConnection, remoteVideoRef]);

  // 設定を保存する関数
  const saveSettings = async () => {
    if (!roomId || typeof roomId !== "string") {
      console.error("無効なroomIdです");
      return;
    }
    const roomRef = doc(db, "rooms", roomId);
    try {
      const newTimeLeft = selectedTime * 60;
      await updateDoc(roomRef, {
        settings: {
          topic: selectedTopic,
          timeLimit: selectedTime,
        },
        timeLeft: newTimeLeft,
      });
      console.log("設定が保存されました");
    } catch (error) {
      console.error("設定の保存中にエラーが発生しました:", error);
    }
  };

  // オファーを作成する関数（ホスト用）
  const createOffer = async () => {
    if (!roomId || typeof roomId !== "string" || !localStream) return;

    peerConnection.current = new RTCPeerConnection();

    // ストリームをPeerConnectionに追加
    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    });

    // オファー作成＆設定
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    // Realtime Databaseに保存
    const offerRef = ref(rtdb, `calls/${roomId}/offer`);
    await set(offerRef, {
      type: offer.type,
      sdp: offer.sdp,
    });

    console.log("Offer を作成して RTDB に保存しました");
  };

  // 議事録の変更をFirestoreに保存する関数
  const handleMinutesChange = async (text: string) => {
    setMinutesText(text);
    if (roomId && typeof roomId === "string") {
      try {
        await updateDoc(doc(db, "rooms", roomId), {
          minutesText: text,
          updatedAt: new Date(), // 更新日時を保存
        });
      } catch (error) {
        console.error("議事録の保存中にエラーが発生しました:", error);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>通話ルーム: {roomId}</h1>

      {/* Firestoreから取得した議題を表示 */}
      <p style={{ fontWeight: "bold" }}>
        今回の議題：{roomTopic || "読み込み中..."}
      </p>

      {/* タイマー表示 */}
      <div style={{ marginTop: "1rem" }}>
        <h2>残り時間</h2>
        <p>
          {timeLeft !== null
            ? `${Math.floor(timeLeft / 60)}分 ${timeLeft % 60}秒`
            : "タイマーを設定中..."}
        </p>
      </div>

      {/* ホスト用のルーム設定 */}
      {isHost && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>ルーム設定</h2>
          <textarea
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="お題を入力"
            style={{
              width: "100%",
              height: "100px",
              marginBottom: "1rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {[...Array(12)].map((_, i) => {
              const minutes = (i + 1) * 5;
              return (
                <option key={minutes} value={minutes}>
                  {minutes}分
                </option>
              );
            })}
          </select>
          <button
            onClick={saveSettings}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            設定を保存
          </button>
          <button
            onClick={createOffer} // オファーを作成して通話を開始
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            通話を開始
          </button>
        </div>
      )}

      {/* 議事録掲示板 */}
      <div style={{ marginTop: "2rem" }}>
        <h2>議事録掲示板</h2>
        <textarea
          value={minutesText}
          onChange={(e) => handleMinutesChange(e.target.value)}
          placeholder="議事録を入力してください..."
          style={{
            width: "100%",
            height: "450px",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* カメラ映像表示 */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <div>
          <h3>自分の映像</h3>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "300px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <h3>相手の映像</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "300px", border: "1px solid #ccc" }}
          />
        </div>
      </div>
    </div>
  );
}