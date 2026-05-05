import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

function SessionDetail() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 CHAT STATE
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // ==============================
  // FETCH SESSION
  // ==============================
  const fetchSession = useCallback(() => {
    if (!token) return;

    fetch(`http://localhost:8001/sessions/api/sessions/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Login again");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setSession(data);
          setLoading(false);
        }
      });
  }, [id, token]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // ==============================
  // LOAD OLD CHAT
  // ==============================
  useEffect(() => {
    if (!token || !session?.is_joined) return;

    fetch(`http://localhost:8001/chat/api/chat/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.slice(-50)));
  }, [id, token, session?.is_joined]);

  // ==============================
  // WEBSOCKET
  // ==============================
  useEffect(() => {
    if (!token || !session?.is_joined) return;

    const ws = new WebSocket(
      `ws://localhost:8001/ws/chat/${id}/?token=${token}`
    );

    socketRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        { user: data.username, message: data.message },
      ]);
    };

    ws.onclose = () => {
      console.log("WS reconnect...");
      setTimeout(() => {
        socketRef.current = new WebSocket(
          `ws://localhost:8001/ws/chat/${id}/?token=${token}`
        );
      }, 2000);
    };

    return () => ws.close();
  }, [id, token, session?.is_joined]);

  // ==============================
  // AUTO SCROLL
  // ==============================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==============================
  // SEND MESSAGE
  // ==============================
  const sendMessage = () => {
    if (!input.trim()) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("Chat not connected");
      return;
    }

    socketRef.current.send(JSON.stringify({ message: input }));
    setInput("");
  };

  // ==============================
  // JOIN
  // ==============================
  const joinSession = () => {
    fetch(`http://localhost:8001/sessions/api/sessions/join/${id}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        fetchSession();
      });
  };

  // ==============================
  // PAYMENT
  // ==============================
  const handlePayment = () => {
    fetch(`http://localhost:8001/payments/api/checkout/${id}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.url;
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="session-detail" style={{ display: "flex", gap: "20px" }}>

      {/* ================= LEFT SIDE ================= */}
      <div style={{ flex: 2 }}>

        <h2>{session.title}</h2>
        <p>{session.description}</p>

        {/* VIDEO */}
        {session.session_type === "live" ? (
          <p>🟢 Live at {session.datetime}</p>
        ) : (
          session.recorded_file && (
            <video controls width="100%">
              <source src={`http://localhost:8001${session.recorded_file}`} />
            </video>
          )
        )}

        {/* STATUS */}
        {session.is_joined && (
          <p style={{ color: "green" }}>✅ Already Joined</p>
        )}

        {/* BUTTONS */}
        <div style={{ marginTop: "10px" }}>

          {!session.is_joined && (
            <button onClick={joinSession}>Join Session</button>
          )}

          <button onClick={handlePayment}>
            💳 Pay & Join
          </button>

          {/* ❌ removed redirect chat */}
          {/* ✅ chat is now inline */}

          <Link to={`/feedback/${id}`}>
            <button>⭐ Feedback</button>
          </Link>

        </div>

      </div>

      {/* ================= RIGHT SIDE CHAT ================= */}
      {session.is_joined && (
        <div style={{
          flex: 1,
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          height: "500px",
          display: "flex",
          flexDirection: "column"
        }}>

          <h3>💬 Live Chat</h3>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {messages.map((m, i) => (
              <p key={i}>
                <strong>{m.user}:</strong> {m.message}
              </p>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div style={{ display: "flex" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{ flex: 1 }}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}

    </div>
  );
}

export default SessionDetail;