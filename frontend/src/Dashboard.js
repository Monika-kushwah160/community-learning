import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("enrollments");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8001/dashboard/api/dashboard/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error:", err));
  }, [token]);

  if (!data) return <p>Loading...</p>;

  const enrollments = data.enrollments || [];
  const mySessions = data.my_sessions || [];

  return (
    <div className="dashboard">

      {/* HEADER */}
      <h1>Welcome back, {data.username} 👋</h1>
      <p>Your learning journey</p>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Sessions Attended</h3>
          <h2>{data.sessions_attended}</h2>
        </div>

        <div className="stat-card">
          <h3>Sessions Taught</h3>
          <h2>{data.sessions_taught}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Points</h3>
          <h2>{data.points}</h2>
        </div>

        <div className="stat-card">
          <h3>Badges</h3>
          <h2>{data.badges}</h2>
        </div>
      </div>

      {/* TABS */}
      <div className="dashboard-tabs">
        <button
          className={tab === "enrollments" ? "tab active" : "tab"}
          onClick={() => setTab("enrollments")}
        >
          My Enrollments ({enrollments.length})
        </button>

        <button
          className={tab === "sessions" ? "tab active" : "tab"}
          onClick={() => setTab("sessions")}
        >
          My Sessions ({mySessions.length})
        </button>
      </div>

      {/* ================= ENROLLMENTS ================= */}
      {tab === "enrollments" && (
        <div className="session-grid">
          {enrollments.length > 0 ? (
            enrollments.map((e, index) => (
              <div className="session-card" key={index}>
                <span className="tag">Enrolled</span>

                <h3>{e.session.title}</h3>

                <p>Instructor: {e.session.instructor}</p>
                <p>{e.session.datetime}</p>

                {/* 🔥 ACTION BUTTONS */}
                <div className="btn-group">

                  {/* 👁 View Details */}
                  <Link to={`/session/${e.session.id}`}>
                    <button className="btn-primary">
                      View Details
                    </button>
                  </Link>


                </div>
              </div>
            ))
          ) : (
            <div className="empty-box">
              <p>No enrollments yet</p>

              <Link to="/sessions">
                <button className="btn-primary">
                  Browse Sessions
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ================= MY SESSIONS ================= */}
      {tab === "sessions" && (
        <div className="session-grid">
          {mySessions.length > 0 ? (
            mySessions.map((s, index) => (
              <div className="session-card" key={index}>
                <span className="tag">Teaching</span>

                <h3>{s.title}</h3>

                <p>Instructor: {s.instructor}</p>
                <p>{s.datetime}</p>

                {/* 🔥 ACTION BUTTON */}
                <div className="btn-group">
                  <Link to={`/session/${s.id}`}>
                    <button className="btn-primary">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-box">
              <p>No sessions created yet</p>

              <Link to="/create-session">
                <button className="btn-primary">
                  Create Session
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Dashboard;