/*import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside style={{ width: "220px", background: "#f0f0f0", padding: "20px" }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/">Dashboard Home</Link>
        <Link to="/create-player">Create Player</Link>
        {/* Add more links like Reports, Player Profiles here 
      </nav>
    </aside>
  );
};

export default Sidebar;*/

/*import React from "react";
import { NavLink } from "react-router-dom";
import "../pages/styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
       Logo 
      <div className="sidebar-logo">
        <span className="logo-icon">⚡</span>
        <span className="logo-text">Apex Athlete</span>
      </div>

     
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          🏠 <span>Dashboard</span>
        </NavLink>

        <NavLink to="/training-sessions" className="nav-item">
          🏋️ <span>Training Sessions</span>
        </NavLink>

        <NavLink to="/players" className="nav-item">
          👥 <span>Players</span>
        </NavLink>

        <NavLink to="/reports" className="nav-item">
          📊 <span>Reports</span>
        </NavLink>
      </nav>

    
      <div className="sidebar-footer">
        © 2026 Apex Athlete
      </div>
    </aside>
  );
};

export default Sidebar;*/


/*import React from "react";
import { NavLink } from "react-router-dom";
import "../pages/styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">⚡ Apex Athlete</div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          Dashboard
        </NavLink>

        <NavLink to="/players" className="nav-item">
          Players
        </NavLink>

        <NavLink to="/training-sessions" className="nav-item">
          Training Sessions
        </NavLink>

        <NavLink to="/reports" className="nav-item">
          Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;*/








import React from "react";
import { NavLink } from "react-router-dom";


const SidebarT = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">⚽ Apex Athlete</div>

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
          TeamAnalytics
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

