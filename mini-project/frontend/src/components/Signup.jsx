import React, { useState } from "react"; 
import axios from "axios";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // ✅ added role
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1 - Register user & send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/s", form);
      alert(res.data.message);
      if (res.data.success) setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: form.email,
        otp,
      });
      alert(res.data.message);

      if (res.data.success) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        
      }}
    >
      {step === 1 && (
        <form
          onSubmit={handleRegister}
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
          <h2 style={{ textAlign: "center" }}>Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          {/* ✅ Role selection added */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Role</option>
            <option value="trainer">Trainer</option>
           
            <option value="analyst">Analyst</option>
          </select>

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
            verify OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleVerifyOtp}
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
          <h2 style={{ textAlign: "center" }}>Enter OTP</h2>

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

          <button
            type="submit"
            style={{
              padding: "14px",
              borderRadius: "10px",
              background: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;

