import React, { useEffect, useState } from "react";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/gamification/api/leaderboard/")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>

      <div className="leaderboard-list">
        {users.map((user, index) => (
          <div className="leaderboard-card" key={user.id}>
            
            <div className="leader-left">
              <div className="rank-badge">{index + 1}</div>

              <div className="avatar-circle">
                {user.username[0].toUpperCase()}
              </div>

              <div>
                <h3>{user.username}</h3>
                <p>
                  {user.sessions_attended} sessions ·{" "}
                  {user.sessions_taught} taught
                </p>
              </div>
            </div>

            <div className="leader-points">
              <h2>{user.points}</h2>
              <span>points</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;