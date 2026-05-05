import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function ChatRoom() {
  const { sessionId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // 🔥 Load old messages
  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8001/chat/api/chat/${sessionId}/`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data.slice(-50)); // keep last 50
      })
      .catch(err => console.error(err));
  }, [sessionId, token]);

  // 🔥 WebSocket connect (FIXED)
  useEffect(() => {
    if (!token) return;

    const wsUrl = `ws://localhost:8001/ws/chat/${sessionId}/?token=${token}`;
    


    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      const newMessage = {
        user: data.username,
        message: data.message,
      };

      // ✅ keep only last 50 messages
      setMessages(prev => {
        const updated = [...prev, newMessage];
        return updated.slice(-50);
      });
    };

    socketRef.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socketRef.current.onclose = () => {
      console.log("⚠️ WebSocket closed");

      // 🔁 Auto reconnect (important)
      setTimeout(() => {
        socketRef.current = new WebSocket(wsUrl);
      }, 2000);
    };

    return () => socketRef.current.close();
  }, [sessionId, token]);

  // 🔥 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    socketRef.current.send(
      JSON.stringify({ message: input })
    );

    setInput("");
  };

  // 🔥 Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>💬 Session Chat</h2>

      {/* CHAT BOX */}
      <div className="chat-box">
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.user}:</strong> {m.message}
          </p>
        ))}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={handleKeyPress}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;