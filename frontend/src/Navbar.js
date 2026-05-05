import React from "react";
import { Link } from "react-router-dom";

function Navbar({ token, logout }) {
  return (
    <nav className="navbar">
      <div className="logo">🎓 LearnHub</div>

      <ul className="menu">
        <li><Link to="/">Home</Link></li>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/badges">My Badges</Link>

        {token ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/create-session">CreateSession</Link></li>
            <li>
              <button onClick={logout} className="btn-primary">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;