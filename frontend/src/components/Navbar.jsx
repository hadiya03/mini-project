import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id })
          });
        }
      }
    } catch (err) {
      console.error("Logout error", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/l");
  };

  return (
    <nav className="app-navbar">
      <div className="app-navbar-brand">
        <span className="app-navbar-icon">⚽</span>
        <span className="app-navbar-title">FitTrack</span>
      </div>
      <div className="app-navbar-actions">
        {!token ? (
          <>
            <Link to="/s" className="app-navbar-btn app-navbar-btn-accent">
              Register
            </Link>
            <Link to="/l" className="app-navbar-btn app-navbar-btn-outline">
              Login
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="app-navbar-btn app-navbar-btn-logout">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
