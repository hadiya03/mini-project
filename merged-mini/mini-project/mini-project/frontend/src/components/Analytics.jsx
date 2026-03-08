import React from "react";
import "./Analytics.css";
import {
  Bar,
  Line,
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analytics = () => {

  /* ======================
     DUMMY DATA
  ====================== */

  // Weekly logins
  const loginData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Logins",
        data: [30, 45, 28, 60, 55, 20, 18],
      }
    ]
  };

  // Active vs Offline
  const statusData = {
    labels: ["Active", "Offline"],
    datasets: [
      {
        data: [18, 42],
      }
    ]
  };

  // Workload trend
  const workloadData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Training Load",
        data: [50, 65, 80, 72],
        tension: 0.4
      }
    ]
  };

  return (
    <div className="analytics-container">

      <h1>System Analytics</h1>
      <p className="subtitle">
        Overview of usage, activity and performance trends
      </p>

      <div className="charts-grid">

        {/* BAR CHART */}
        <div className="chart-card">
          <h3>Weekly Logins</h3>
          <Bar data={loginData} />
        </div>

        {/* PIE CHART */}
        <div className="chart-card">
          <h3>User Status</h3>
          <Pie data={statusData} />
        </div>

        {/* LINE CHART */}
        <div className="chart-card full-width">
          <h3>Training Workload Trend</h3>
          <Line data={workloadData} />
        </div>

      </div>

    </div>
  );
};

export default Analytics;

