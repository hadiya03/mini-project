import React from "react";
import { NavLink } from "react-router-dom";

const SidebarT = () => {
  return (
    <aside className="sidebar">

      <nav className="sidebar-nav">
        <NavLink
          to="/trainer-dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/trainer-players"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Players
        </NavLink>

        <NavLink
          to="/trainer-training-sessions"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Training Sessions
        </NavLink>
        <NavLink
          to="/team-analysis"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Team Analytics
        </NavLink>
        <NavLink
          to="/trainer-reports"
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

export default SidebarT;
