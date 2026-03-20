/*import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/styles/dashboard.css";

const Dashboard = () => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [avgReadiness, setAvgReadiness] = useState(0);
  const [playersAtRisk, setPlayersAtRisk] = useState(0);
  const [players, setPlayers] = useState([]);

  
  const [atRiskPlayers, setAtRiskPlayers] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchPlayers();
  }, []);

  const fetchDashboard = async () => {
    const res = await axios.get("http://localhost:5000/api/dashboard");
    setTotalPlayers(res.data.totalPlayers);
    setAvgReadiness(res.data.averageReadiness);
    setPlayersAtRisk(res.data.playersAtRisk);

  
    setAtRiskPlayers(res.data.atRiskPlayers || []);
  };

  const fetchPlayers = async () => {
    const res = await axios.get("http://localhost:5000/api/player/players");
    setPlayers(res.data);
  };

  return (
    <div className="dashboard-container">
      

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Players</h3>
          <p>{totalPlayers}</p>
        </div>

        <div className="stat-card">
          <h3>Average Readiness</h3>
          <p>{avgReadiness}%</p>
        </div>

        <div className="stat-card danger">
          <h3>Players At Risk</h3>
          <p>{playersAtRisk}</p>
        </div>
      </div>

      <div className="card">
        <h2>Players</h2>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Position</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.position}</td>
                <td>{p.current_team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card readiness">
        <h2>Overall Readiness Status</h2>
        <div className="circle">{avgReadiness}%</div>
        <p className={avgReadiness >= 75 ? "good" : "warning"}>
          {avgReadiness >= 75
            ? "Good – Optimal training load maintained"
            : "Warning – Monitor workload closely"}
        </p>
      </div>

     
      {atRiskPlayers.length > 0 && (
        <div className="card danger">
          <h2>Injury Risk Alerts</h2>
          <ul className="risk-list">
            {atRiskPlayers.map((player) => (
              <li key={player.id}>
                ⚠️ <strong>{player.name}</strong> — Readiness{" "}
                {player.readiness}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;*/








import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/styles/dashboard.css";

const Dashboard = () => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [avgReadiness, setAvgReadiness] = useState(0);
  const [playersAtRisk, setPlayersAtRisk] = useState(0);
  const [players, setPlayers] = useState([]);

  
  const [atRiskPlayers, setAtRiskPlayers] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchPlayers();
  }, []);

  const fetchDashboard = async () => {
    const res = await axios.get("http://localhost:5000/api/dashboard");
    setTotalPlayers(res.data.totalPlayers);
    setAvgReadiness(res.data.averageReadiness);
    setPlayersAtRisk(res.data.playersAtRisk);

    /* ✅ NEW (safe addition) */
    setAtRiskPlayers(res.data.atRiskPlayers || []);
  };

  const fetchPlayers = async () => {
    const res = await axios.get("http://localhost:5000/api/player/players");
    setPlayers(res.data);
  };

  return (
    <div className="dashboard-container">
      

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Players</h3>
          <p>{totalPlayers}</p>
        </div>

        <div className="stat-card">
          <h3>Average Readiness</h3>
          <p>{avgReadiness}%</p>
        </div>

        <div className="stat-card danger">
          <h3>Players At Risk</h3>
          <p>{playersAtRisk}</p>
        </div>
      </div>

      <div className="card">
        <h2>Players</h2>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Position</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.position}</td>
                <td>{p.current_team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card readiness">
        <h2>Overall Readiness Status</h2>
        <div className="circle">{avgReadiness}%</div>
        <p className={avgReadiness >= 75 ? "good" : "warning"}>
          {avgReadiness >= 75
            ? "Good – Optimal training load maintained"
            : "Warning – Monitor workload closely"}
        </p>
      </div>

      {/* ✅ NEW SECTION — matches your screenshot */}
      {atRiskPlayers.length > 0 && (
        <div className="card danger">
          <h2>Injury Risk Alerts</h2>
          <ul className="risk-list">
            {atRiskPlayers.map((player) => (
              <li key={player.id}>
                ⚠️ <strong>{player.name}</strong> — {player.risk_level} ({player.injury_risk})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

