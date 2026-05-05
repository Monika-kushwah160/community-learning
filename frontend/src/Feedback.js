import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import "./feedback.css";

function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    rating: 0,
    comment: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    setMessage("");

    if (!token) {
      setError("⚠️ Please login first");
      return;
    }

    if (!form.rating) {
      setError("⚠️ Please select a rating");
      return;
    }

    setLoading(true);

    fetch(`http://localhost:8001/sessions/api/sessions/feedback/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit feedback");
        return res.json();
      })
      .then((data) => {
        setMessage("✅ Feedback submitted successfully!");

        setTimeout(() => {
          navigate(`/session/${id}`);
        }, 1200);
      })
      .catch((err) => setError("❌ " + err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="feedback-wrapper">

      <div className="feedback-card">

        <h2>⭐ Leave Feedback</h2>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        {/* ⭐ Star Rating */}
        <div className="stars">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => setForm({ ...form, rating: num })}
              className={num <= form.rating ? "star active" : "star"}
            >
              ★
            </span>
          ))}
        </div>

        <p className="rating-text">
          {form.rating ? `You selected ${form.rating} star` : "Select rating"}
        </p>

        {/* 💬 Comment */}
        <textarea
          placeholder="Write your feedback..."
          value={form.comment}
          onChange={(e) =>
            setForm({ ...form, comment: e.target.value })
          }
        />

        {/* 🚀 Button */}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback 🚀"}
        </button>

      </div>

    </div>
  );
}

export default Feedback;