import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateSession() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    datetime: "",
    session_type: "live",
  });

  const [file, setFile] = useState(null);

  // 🔥 UX states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!form.title || !form.category || !form.datetime) {
      setMessage("⚠️ Please fill required fields");
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    if (file) formData.append("recorded_file", file);

    setLoading(true);
    setMessage("");

    fetch("http://localhost:8001/sessions/api/sessions/create/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);

        // ✅ success message
        setMessage("✅ Session created successfully!");

        // 🔥 OPTION 1: redirect to sessions list
        setTimeout(() => {
          navigate("/sessions");
        }, 1000);

        // 🔥 OPTION 2 (alternative): redirect to detail page
        // navigate(`/session/${data.id}`);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setMessage("❌ Something went wrong");
      });
  };

  return (
    <div className="session-form">
      <h2>Create Session</h2>

      {/* 🔥 Message UI */}
      {message && <p>{message}</p>}

      <input
        placeholder="Title"
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Category"
        onChange={e => setForm({ ...form, category: e.target.value })}
      />

      <textarea
        placeholder="Description"
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="datetime-local"
        onChange={e => setForm({ ...form, datetime: e.target.value })}
      />

      <select
        onChange={e => setForm({ ...form, session_type: e.target.value })}
      >
        <option value="live">Live</option>
        <option value="recorded">Recorded</option>
      </select>

      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
      />

      {/* 🔥 Button with loading */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}

export default CreateSession;