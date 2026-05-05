import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Sessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/sessions/api/sessions/")
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="session-container">
      <h2>Browse Sessions</h2>

      <div className="sessions-grid">
        {sessions.length > 0 ? (
          sessions.map(s => (
            <div className="session-card" key={s.id}>
              <h3>{s.title}</h3>

              <p><b>Category:</b> {s.category}</p>
              <p><b>Instructor:</b> {s.instructor}</p>

              <Link to={`/session/${s.id}`} className="session-btn">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>No sessions available</p>
        )}
      </div>
    </div>
  );
}

export default Sessions;