import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import Sessions from "./Sessions";
import SessionDetail from "./SessionDetail";
import CreateSession from "./CreateSession";
import Navbar from "./Navbar";
import ChatRoom from "./ChatRoom";
import Leaderboard from "./Leaderboard";
import MyBadges from "./MyBadges";
import PaymentSuccess from "./PaymentSuccess";
import PaymentCancel from "./PaymentCancel";
import Feedback from "./Feedback";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);   // ✅ triggers re-render
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);

    window.location.href = "/login";
};
  return (
    <BrowserRouter>
      <Navbar token={token} logout={logout} />
      <Routes>

        <Route path="/" element={<Home />} />

         <Route
          path="/login"
          element={!token ? <Login setToken={login} /> : <Navigate to="/dashboard" />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/create-session" element={<CreateSession />} />
        <Route path="/chat/:sessionId" element={<ChatRoom />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/feedback/:id" element={<Feedback />} />
        <Route path="/badges" element={<MyBadges />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;