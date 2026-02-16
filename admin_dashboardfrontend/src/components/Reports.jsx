import React, { useState } from "react";
import { jsPDF } from "jspdf";

const Reports = () => {
  const [reportData] = useState([
    { id: 1, player: "Player 1", score: 85, level: "Intermediate" },
    { id: 2, player: "Player 2", score: 92, level: "Advanced" },
    { id: 3, player: "Player 3", score: 70, level: "Beginner" },
  ]);

  // Function to download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Player Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    // Table header
    const headers = [["Player", "Score", "Level"]];

    // Table rows
    const rows = reportData.map((r) => [r.player, r.score, r.level]);

    // Add table using autoTable plugin (optional)
    if (doc.autoTable) {
      doc.autoTable({
        head: headers,
        body: rows,
        startY: 30,
      });
    } else {
      // Manual table if autoTable is not installed
      let y = 30;
      doc.text("Player | Score | Level", 14, y);
      y += 10;
      rows.forEach((row) => {
        doc.text(row.join(" | "), 14, y);
        y += 10;
      });
    }

    doc.save("report.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reports</h1>
      <p>Download player report as PDF.</p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#1f2937", color: "#fff" }}>
            <th style={{ padding: "10px" }}>Player</th>
            <th style={{ padding: "10px" }}>Score</th>
            <th style={{ padding: "10px" }}>Level</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "10px" }}>{r.player}</td>
              <td style={{ padding: "10px" }}>{r.score}</td>
              <td style={{ padding: "10px" }}>{r.level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default Reports;



