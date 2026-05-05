import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div>

      {/* HERO */}
      <section className="hero">
        <h1>
          Learn anything from <span className="purple">anyone</span>, teach what you{" "}
          <span className="orange">love</span>
        </h1>

        <p>
          Join a vibrant community where everyone is both a teacher and learner.
        </p>

        <div className="buttons">
          <Link to="/sessions" className="btn-explore">
            📖 Explore Sessions
          </Link>

          {token ? (
            <Link to="/dashboard" className="btn-teach">
              Start Teaching
            </Link>
          ) : (
            <Link to="/login" className="btn-teach">
              Start Teaching
            </Link>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why LearnHub?</h2>

        <div className="card-container">
          <div className="card">
            ⭐
            <h3>Gamification & Rewards</h3>
            <p>Earn points, unlock badges, climb leaderboard.</p>
          </div>

          <div className="card">
            ⚡
            <h3>Short & Focused</h3>
            <p>30–60 minute sessions for effective learning.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to start learning?</h2>
        <p>Your next skill is just one session away.</p>
        <button>Get Started →</button>
      </section>

    </div>
  );
}

export default Home;