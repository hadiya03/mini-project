import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";

// Components

import AdminDashboard from "./components/AdminDashboard.jsx";
import Analytics from "./components/Analytics.jsx";
import ManageUsers from "./components/ManageUsers.jsx";
import Reports from "./components/Reports.jsx";
import Metrics from "./components/Metrics.jsx";
import SystemLogs from "./components/SystemLogs.jsx";

function App() {
  // Shared player data (used by PlayerTrainerPanel and Reports)
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", score: 0 },
    { id: 2, name: "Player 2", score: 0 },
    { id: 3, name: "Player 3", score: 0 },
  ]);

  return (
    <Router>
      <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#f3f4f6" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
           
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/reports"
              element={<Reports players={players} />}
            />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/system-logs" element={<SystemLogs />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

