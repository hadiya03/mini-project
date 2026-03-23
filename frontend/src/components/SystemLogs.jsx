import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/logs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("System logs response was not an array:", data);
          setLogs([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch logs:", err);
        setLogs([]);
      });
  }, []);

  // Compute active users so we can display the correct status
  // A user is truly active if their very newest log has no logout_time
  const activeEmails = new Set();
  const handledUsers = new Set();
  
  // Create a sorted copy to scan freshest first
  const sortedLogs = [...logs].sort((a, b) => new Date(b.login_time) - new Date(a.login_time));
  
  for (const log of sortedLogs) {
    if (!handledUsers.has(log.email)) {
      handledUsers.add(log.email);
      if (!log.logout_time || log.logout_time === "") {
        activeEmails.add(log.email);
      }
    }
  }

  return (
    <div className="dashboard">
      <h1>System Logs (Admin Only)</h1>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sortedLogs.map((log, i) => {
              // Row is actively online ONLY IF it has no logout time
              // Historical rows for a currently online user that DO have a logout time 
              // still count as offline sessions from the past.
              const isSessionActive = !log.logout_time || log.logout_time === "";

              return (
                <tr key={i}>
                  <td>{log.email}</td>
                  <td>{log.role}</td>
                  <td>{new Date(log.login_time).toLocaleString()}</td>
                  <td>
                    {log.logout_time
                      ? new Date(log.logout_time).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {isSessionActive
                      ? <span className="online">Online</span>
                      : <span className="offline">Offline</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

