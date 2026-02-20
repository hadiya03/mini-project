import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/forgot-password", { email });
      setMsg("OTP sent to your email");

       setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);

    } catch (err) {
      setMsg("Email not found");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        maxWidth: "400px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: "14px", borderRadius: "10px", border: "1px solid #ccc" }}
      />

      <button
        type="submit"
        style={{
          padding: "14px",
          borderRadius: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
        }}
      >
        Send OTP
      </button>

      {msg && <p style={{ textAlign: "center", color: "green" }}>{msg}</p>}
    </form>
  );
};

export default ForgotPassword;
