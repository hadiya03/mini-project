import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebarre.css";

const Sidebarr = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Admin Dashboard", path: "/admin" },
    { name: "Analytics", path: "/analytics" },
    { name: "Manage Users", path: "/manage-users" },
    { name: "System Logs", path: "/system-logs" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">⚽ Admin Panel</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item${location.pathname === item.path ? " active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebarr;
