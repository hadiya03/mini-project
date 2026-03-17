import React from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <nav style={{
      background: "linear-gradient(135deg, #1f5f37 0%, #167934 100%)",
      padding: "1rem",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      borderBottom: "3px solid rgba(255,255,255,0.2)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "24px", animation: "bounce 2s infinite" }}>⚽</span>
        <span style={{ fontWeight: "bold", fontSize: "18px", color: "white" }}>Football Manager</span>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        {!token ? (
          <>
            <Link
              to="/s"
              style={{
                padding: "0.5rem 1rem",
                background: "linear-gradient(135deg, #ffd700 0%, #ffb347 100%)",
                color: "#0a3622",
                textDecoration: "none",
                borderRadius: "5px",
                fontWeight: "bold"
              }}
            >
              Register
            </Link>
            <Link
              to="/l"
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
                border: "2px solid rgba(255,255,255,0.5)"
              }}
            >
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



