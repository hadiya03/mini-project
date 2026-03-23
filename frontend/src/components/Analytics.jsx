import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import "./Analytics.css";
import {
  Bar,
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analytics = () => {

  const [data, setData] = useState({
    weeklyLogins: { labels: [], data: [] },
    userStatus: { active: 0, offline: 0 },
    workloadTrend: { labels: [], data: [] }
  });

  useEffect(() => {
    fetch(`${API_URL}/api/analytics`)
      .then(res => res.json())
      .then(result => {
        if (result && result.weeklyLogins) {
          setData(result);
        } else {
          console.error("Invalid analytics data from server:", result);
        }
      })
      .catch(err => console.error("Analytics fetch error:", err));
  }, []);

  const loginData = {
    labels: data?.weeklyLogins?.labels || [],
    datasets: [
      {
        label: "Logins",
        data: data?.weeklyLogins?.data || [],
        backgroundColor: "rgba(79, 70, 229, 0.8)", // Indigo
        borderColor: "rgba(67, 56, 202, 1)",
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const statusData = {
    labels: ["Active", "Offline"],
    datasets: [
      {
        data: [data?.userStatus?.active || 0, data?.userStatus?.offline || 0],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)", // Emerald Green for Active
          "rgba(239, 68, 68, 0.8)",  // Red for Offline
        ],
        borderColor: [
          "rgba(5, 150, 105, 1)",
          "rgba(220, 38, 38, 1)",
        ],
        borderWidth: 1,
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

      </div>

    </div>
  );
};

export default Analytics;

