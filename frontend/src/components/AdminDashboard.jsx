import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
  };

  const fetchLogs = async () => {
    const res = await axios.get("http://localhost:5000/api/logs");
    setLogs(res.data);
  };

  // Filter to get only the most recent log per user
  const latestLogs = [];
  const handledUsers = new Set();
  
  // Sort logs by login_time descending to guarantee we capture the truest recent status
  const sortedLogs = [...logs].sort((a, b) => new Date(b.login_time) - new Date(a.login_time));

  for (const log of sortedLogs) {
    if (!handledUsers.has(log.email)) {
      latestLogs.push(log);
      handledUsers.add(log.email);
    }
  }

  // A user is ACTIVE if their most recent log has a null/empty logout_time
  const activeUsers = latestLogs.filter(l => l.logout_time === null || l.logout_time === "").length;
  // A user is OFFLINE if their most recent log has a logout_time
  const loggedOutUsers = latestLogs.filter(l => l.logout_time !== null && l.logout_time !== "").length;

  return (
    <div className="dashboard">

      
      <p className="subtitle">
        Overview of system activity and performance
      </p>

      {/* ================= KPI CARDS ================= */}
      <div className="kpi-grid">

        <div className="kpi-card">
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>

        <div className="kpi-card">
          <h2>{activeUsers}</h2>
          <p>Active Now</p>
        </div>

        <div className="kpi-card">
          <h2>{logs.length}</h2>
          <p>Total Logins</p>
        </div>

        <div className="kpi-card">
          <h2>{loggedOutUsers}</h2>
          <p>Currently Offline</p>
        </div>

      </div>


      {/* ================= RECENT ACTIVITY ================= */}
      <div className="recent-card">
        <h3>Recent Activity</h3>

        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Login Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {latestLogs.slice(0, 5).map((log, i) => (
              <tr key={i}>
                <td>{log.email}</td>
                <td>{new Date(log.login_time).toLocaleString()}</td>
                <td>
                  {log.logout_time
                    ? <span className="offline">Offline</span>
                    : <span className="online">Online</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;
