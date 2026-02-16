import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const activeUsers = logs.filter(l => !l.logout_time).length;

  return (
    <div className="dashboard">

      <h1>Admin Dashboard</h1>
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
          <h2>{logs.length - activeUsers}</h2>
          <p>Logged Out</p>
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
            {logs.slice(0, 5).map((log, i) => (
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
