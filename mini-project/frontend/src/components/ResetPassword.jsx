import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/reset-password",
        { email, otp, newPassword }
      );

      setMsg(res.data.message);

      // Redirect to login after success
      if (res.data.message.toLowerCase().includes("successful")) {
        setTimeout(() => navigate("/l"), 2000);
      }

    } catch (err) {
      setMsg(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <form
      onSubmit={handleReset}
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Reset Password</h2>

      <input
        type="email"
        placeholder="Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        style={{
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        style={{
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "14px",
          borderRadius: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Reset Password
      </button>

      {msg && (
        <p style={{ textAlign: "center", color: "green" }}>
          {msg}
        </p>
      )}
    </form>
  );
};

export default ResetPassword;
