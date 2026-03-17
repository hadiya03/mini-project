/*import React, { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/l", {
        email,
        password,
      });

      if (res.data.success) {
        alert(res.data.message);

        localStorage.setItem("token", res.data.token || "dummy_token"); 
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="football-form"
    >
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

      
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <a
          href="/forgot-password"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
      >
        Login
      </button>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Don't have an account?{" "}
        <a href="/s">
          Register
        </a>
      </p>
    </form>
  );
        </a>
      </p>
    </form>
  );
};

export default Login;*/





import React, { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/l", {
        email,
        password,
      });

      if (res.data.success) {
        alert(res.data.message);

        // ✅ Store real token only
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;

        // ✅ Correct Role Based Redirect
        if (role === "trainer") {
          navigate("/trainer-dashboard");
        } else if (role === "analyst") {
          navigate("/analyst-dashboard");
        } else if (role === "player"){
          navigate("/playerdashboard"); // safe fallback
        }
        else if (role === "admin"){
          navigate("/admin"); // safe fallback
        }

      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: "14px", borderRadius: "10px", border: "1px solid #ccc" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: "14px", borderRadius: "10px", border: "1px solid #ccc" }}
      />

      <div style={{ textAlign: "right" }}>
        <a
          href="/forgot-password"
          style={{
            fontSize: "14px",
            color: "#007bff",
            textDecoration: "none",
          }}
        >
          Forgot password?
        </a>
      </div>

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
        Login
      </button>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don’t have an account?{" "}
        <a href="/s" style={{ color: "#007bff", textDecoration: "none" }}>
          Register
        </a>
      </p>
    </form>
  );
};

export default Login;


