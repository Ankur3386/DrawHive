"use client";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import axios from "axios";
import { useRouter } from "next/navigation"; 

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();  // ✅ add this

  useEffect(() => {
    return () => {
      router.refresh()  // fires when leaving canvas page
    }
  }, [])

useEffect(() => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    setError("No token found");
    setLoading(false); // 🔥 important
    return;
  }

  setToken(storedToken);

  let ws: WebSocket;

  const init = async () => {
    try {
      setError("");

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/join/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`, // ✅ use local variable
          },
        }
      );

      ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}?token=${storedToken}` // ✅ use local variable
      );

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "join_room",
            roomId,
          })
        );
        setSocket(ws);
        setLoading(false); // ✅ stops "Connecting..."
      };

      ws.onerror = () => {
        setError("WebSocket error");
        setLoading(false);
      };
    } catch (err) {
      setError("Error joining room");
      setLoading(false);
    }
  };

  init();

  return () => {
    if (ws) ws.close();
  };
}, [roomId]);

  if (loading) {
    return<div className="flex items-center justify-center gap-2 text-2xl">
  <span className="w-5 h-5 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin"></span>
  Connecting...
</div>
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!socket||!token) {
    return <div>Socket not available</div>;
  }

  return (
    <div className="h-screen w-screen">
      <Canvas roomId={roomId} socket={socket} token={token} />
    </div>
  );
}