import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Player Trainer Panel", path: "/player-trainer" },
    { name: "Admin Dashboard", path: "/admin" },
    { name: "Analytics", path: "/analytics" },
    { name: "Manage Users", path: "/manage-users" },
    { name: "Reports", path: "/reports" },
    { name: "Metrics", path: "/metrics" },
    { name: "System Logs", path: "/system-logs" },
  ];

  return (
    <div
      style={{
        width: "220px",
        background: "#1f2937",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px", color: "#10b981" }}>Admin Panel</h2>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            padding: "10px 15px",
            marginBottom: "10px",
            textDecoration: "none",
            color: location.pathname === item.path ? "#10b981" : "#fff",
            background: location.pathname === item.path ? "#111827" : "transparent",
            borderRadius: "6px",
            transition: "0.2s",
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;


