import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import "./trainingSessions.css";
import { API_URL } from "../../config";

const TrainingSessionsT = () => {
  /* ================= STATE ================= */

  const [form, setForm] = useState({
    session_date: "",
    duration_minutes: "",
    distance_km: "",
    rpe: 5,
  });

  const [sessions, setSessions] = useState([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/training-sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FORM ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      session_date: "",
      duration_minutes: "",
      distance_km: "",
      rpe: 5,
    });
  };

  const saveSession = async () => {
    if (!form.session_date || !form.duration_minutes) {
      toast.error("Date and Duration required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/training-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const saved = await res.json();

      setSessions([saved, ...sessions]);
      resetForm();
    } catch {
      toast.error("Error saving session");
    }
  };

  /* ================= RISK CALCULATION ================= */

  const getRiskStatus = (s) => {
    const load = s.rpe * s.duration_minutes;

    if (load > 800) return { text: "Overtraining Risk", color: "#dc2626" };
    if (load > 500) return { text: "High Fatigue", color: "#f59e0b" };

    return { text: "Normal", color: "#16a34a" };
  };

  /* ================= PDF EXPORT ================= */

  const exportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      "Date",
      "Duration",
      "Distance",
      "RPE",
      "Load",
      "Status",
    ];

    const rows = sessions.map((s) => {
      const risk = getRiskStatus(s);

      return [
        s.session_date,
        s.duration_minutes,
        s.distance_km || 0,
        s.rpe,
        s.rpe * s.duration_minutes,
        risk.text,
      ];
    });

    doc.text("Training Sessions Report", 14, 15);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("training-sessions-report.pdf");
  };

  /* ================= UI ================= */

  return (
    <div className="training-container">
      <h2>Training & Match Data Collection</h2>
      <p>Record sessions and monitor player workload risk.</p>

      {/* ===== FORM ===== */}
      <div className="form-card">
        <label>
          Session Date
          <input type="date" name="session_date" value={form.session_date} onChange={handleChange} />
        </label>

        <label>
          Duration (minutes)
          <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={handleChange} />
        </label>

        <label>
          Distance (km)
          <input type="number" name="distance_km" value={form.distance_km} onChange={handleChange} />
        </label>

        <label>
          Intensity (RPE): {form.rpe}
          <input type="range" min="1" max="10" name="rpe" value={form.rpe} onChange={handleChange} />
        </label>

        <div className="actions">
          <button className="secondary" onClick={resetForm}>Cancel</button>
          <button className="primary" onClick={saveSession}>Save</button>
        </div>
      </div>

      {/* ===== ALERT BANNER ===== */}
      {sessions.some((s) => getRiskStatus(s).text !== "Normal") && (
        <div className="alert-banner">
          ⚠ Some sessions show fatigue or injury risk. Review highlighted rows.
        </div>
      )}

      {/* ===== EXPORT BUTTON ===== */}
      {sessions.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <button className="primary" onClick={exportPDF}>
            Export PDF
          </button>
        </div>
      )}

      {/* ===== TABLE ===== */}
      {sessions.length > 0 && (
        <div className="table-wrapper">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration</th>
                <th>Distance</th>
                <th>RPE</th>
                <th>Load</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((s) => {
                const risk = getRiskStatus(s);

                return (
                  <tr key={s.id}>
                    <td>{s.session_date}</td>
                    <td>{s.duration_minutes}</td>
                    <td>{s.distance_km || 0}</td>
                    <td>{s.rpe}</td>
                    <td>{s.rpe * s.duration_minutes}</td>
                    <td>
                      <span className="status-badge" style={{ background: risk.color }}>
                        {risk.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainingSessionsT;

