/*import React from "react";
import { NavLink } from "react-router-dom";
import "../pages/styles/sidebar-new.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">⚽</span>
        Apex Athlete
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/analyst-dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/players"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          👥 Players
        </NavLink>

        <NavLink
          to="/training-sessions"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          🏃 Training Sessions
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          📊 Reports
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        Football Management System
      </div>
    </aside>
  );
};

export default Sidebar;*/








import React from "react";
import { NavLink } from "react-router-dom";
import "../pages/styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">⚽ Apex Athlete</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/analyst-dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/players"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Players
        </NavLink>

        <NavLink
          to="/training-sessions"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Training Sessions
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;


