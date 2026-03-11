import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebarre.css"

const Sidebarr = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Admin Dashboard", path: "/admin" },
    { name: "Analytics", path: "/analytics" },
    { name: "Manage Users", path: "/manage-users" },
    
    { name: "System Logs", path: "/system-logs" },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Admin Panel</h2>

      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            ...styles.link,
            ...(location.pathname === item.path ? styles.active : {}),
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "230px",
    background: "#1f2937",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    minHeight: "100vh", // ✅ full height
  },
  title: {
    marginBottom: "30px",
    color: "#10b981",
  },
  link: {
    padding: "12px 15px",
    marginBottom: "10px",
    textDecoration: "none",
    color: "#fff",
    borderRadius: "6px",
    transition: "0.2s",
  },
  active: {
    color: "#10b981",
    background: "#111827",
  },
};

export default Sidebarr;
