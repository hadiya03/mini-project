import React, { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/l`, {
        email,
        password,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        // Store real token only
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;

        // Role Based Redirect
        if (role === "trainer") {
          navigate("/trainer-dashboard");
        } else if (role === "analyst") {
          navigate("/analyst-dashboard");
        } else if (role === "player"){
          navigate("/playerdashboard");
        }
        else if (role === "admin"){
          navigate("/admin");
        }

      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="football-form">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div style={{ textAlign: "right", marginBottom: "12px" }}>
        <a href="/forgot-password">
          Forgot password?
        </a>
      </div>

      <button type="submit">
        Login
      </button>

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        Don't have an account?{" "}
        <a href="/s">
          Register
        </a>
      </p>
    </form>
  );
};

export default Login;
