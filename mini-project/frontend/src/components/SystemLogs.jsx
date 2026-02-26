import { useEffect, useState } from "react";

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/logs")
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

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
            {logs.map((log, i) => (
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
                  {log.logout_time ? "Offline" : "Online"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

