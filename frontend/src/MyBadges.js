import React, { useEffect, useState } from "react";

function MyBadges() {
  const [badges, setBadges] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8001/gamification/api/badges/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => setBadges(data));
  }, [token]);

  return (
    <div>
      <h2>My Badges</h2>

      <div className="badge-grid">
        {badges.length > 0 ? (
          badges.map((b, i) => (
            <div className="badge-card" key={i}>
              <h3>{b.name}</h3>
              <p>{b.description}</p>
            </div>
          ))
        ) : (
          <p>No badges yet</p>
        )}
      </div>
    </div>
  );
}

export default MyBadges;