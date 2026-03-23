import React, { useState } from "react"; 
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../config";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1 - Register user & send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/s`, form);
      toast.success(res.data.message);
      if (res.data.success) setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error registering user");
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: form.email,
        otp,
      });
      toast.success(res.data.message);

      if (res.data.success) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
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
        <form onSubmit={handleRegister} className="football-form">
          <h2>Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="trainer">Trainer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">
            Verify OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="football-form">
          <h2>Enter OTP</h2>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit">
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
