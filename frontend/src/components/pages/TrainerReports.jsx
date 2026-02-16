import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./reports.css";

const monthlyPerformanceData = [
  { month: "Jan", performance: 65, readiness: 72 },
  { month: "Feb", performance: 70, readiness: 75 },
  { month: "Mar", performance: 68, readiness: 70 },
  { month: "Apr", performance: 75, readiness: 78 }
];

const readinessTrendData = [
  { month: "Jan", readiness: 80 },
  { month: "Feb", readiness: 78 },
  { month: "Mar", readiness: 74 },
  { month: "Apr", readiness: 76 }
];

const injuryRiskData = [
  { month: "Jan", risk: 4 },
  { month: "Feb", risk: 6 },
  { month: "Mar", risk: 8 },
  { month: "Apr", risk: 5 }
];

const workloadData = [
  { month: "Jan", load: 1400 },
  { month: "Feb", load: 1550 },
  { month: "Mar", load: 1350 },
  { month: "Apr", load: 1600 }
];

const overallTrendData = [
  { month: "Jan", performance: 72, readiness: 78, workload: 65 },
  { month: "Feb", performance: 75, readiness: 80, workload: 70 },
  { month: "Mar", performance: 73, readiness: 74, workload: 68 },
  { month: "Apr", performance: 78, readiness: 82, workload: 72 },
  { month: "May", performance: 80, readiness: 85, workload: 74 },
  { month: "Jun", performance: 82, readiness: 87, workload: 76 }
];

const TrainerReports = () => {
  const [filters, setFilters] = useState({
    player: "All Players",
    team: "All Teams",
    season: "2023-2024"
  });

  return (
    <div className="reports-container">
      <h2>Reports Overview</h2>
      <p className="subtitle">
        Generate and analyze comprehensive reports based on player, team, and season data.
      </p>

      {/* Filters */}
      <div className="filters">
        <select>
          <option>All Players</option>
          <option>Player 1</option>
          <option>Player 2</option>
        </select>

        <select>
          <option>All Teams</option>
          <option>Team A</option>
          <option>Team B</option>
        </select>

        <select>
          <option>2023-2024 Season</option>
          <option>2022-2023 Season</option>
        </select>

        <button className="btn-primary">Apply Filters</button>
        <button className="btn-outline">Export PDF</button>
      </div>

      {/* Report Cards */}
      <div className="report-grid">
        {/* Monthly Performance */}
        <div className="card">
          <h4>Monthly Performance Overview</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="performance" stroke="#6366f1" />
              <Line type="monotone" dataKey="readiness" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Readiness Trend */}
        <div className="card">
          <h4>Player Readiness Trends</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={readinessTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="readiness" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Injury Risk */}
        <div className="card">
          <h4>Injury Risk Assessment</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={injuryRiskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workload */}
        <div className="card">
          <h4>Team Workload Analysis</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="load" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="card full-width">
        <h4>Player Performance Trend (Overall Score)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overallTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="performance" fill="#6366f1" />
            <Bar dataKey="readiness" fill="#22c55e" />
            <Bar dataKey="workload" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Automation */}
      <div className="card">
        <h4>Scheduled Reports</h4>

        <div className="automation-grid">
          <select>
            <option>Monthly Performance Summary</option>
          </select>

          <select>
            <option>Monthly</option>
            <option>Weekly</option>
          </select>

          <input type="email" value="coach@example.com" readOnly />
          <input type="date" value="2024-08-01" readOnly />
          <input type="time" value="08:00" readOnly />

          <button className="btn-primary">Schedule Report</button>
        </div>
      </div>
    </div>
  );
};

export default TrainerReports;
