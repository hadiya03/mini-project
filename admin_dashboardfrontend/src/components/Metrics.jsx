import React, { useState } from "react";

const Metrics = () => {
  const initialMetrics = [
    { id: 1, name: "Track 1", distance: 500, unit: "m" },
    { id: 2, name: "Track 2", distance: 2, unit: "km" },
    { id: 3, name: "Track 3", distance: 1200, unit: "m" },
  ];

  const [metrics, setMetrics] = useState(initialMetrics);

  // Change numeric value
  const handleValueChange = (id, value) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, distance: value } : m))
    );
  };

  // Change unit and convert
  const handleUnitChange = (id, newUnit) => {
    setMetrics((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          let newValue = m.distance;
          if (m.unit === "m" && newUnit === "km") newValue = (m.distance / 1000).toFixed(3);
          if (m.unit === "km" && newUnit === "m") newValue = (m.distance * 1000).toFixed(0);
          return { ...m, distance: newValue, unit: newUnit };
        }
        return m;
      })
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "15px" }}>Metrics</h1>
      <p>Edit distances and units below:</p>

      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
          <thead>
            <tr style={{ background: "#1f2937", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Track</th>
              <th style={{ padding: "12px" }}>Distance</th>
              <th style={{ padding: "12px" }}>Unit</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr
                key={m.id}
                style={{
                  background: "#fff",
                  borderBottom: "1px solid #e5e7eb",
                  transition: "0.2s",
                }}
              >
                <td style={{ padding: "12px" }}>{m.name}</td>
                <td style={{ padding: "12px" }}>
                  <input
                    type="number"
                    value={m.distance}
                    onChange={(e) => handleValueChange(m.id, e.target.value)}
                    style={{
                      width: "100px",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={m.unit}
                    onChange={(e) => handleUnitChange(m.id, e.target.value)}
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                    }}
                  >
                    <option value="m">m</option>
                    <option value="km">km</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "20px",
          background: "#f3f4f6",
          padding: "10px",
          borderRadius: "6px",
          fontFamily: "monospace",
        }}
      >
        <strong>Current Metrics Data:</strong>
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Metrics;

