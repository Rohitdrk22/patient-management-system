import React, { useState } from "react";
import api from "../api/axios"; // ✅ IMPORTANT

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Sending:", form); // 🔍 debug

      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim()
      });

      console.log("Response:", res.data); // 🔍 debug

      // ✅ store token
      localStorage.setItem("token", res.data.token);

      // ✅ go to app
      onLoginSuccess();

    } catch (err) {
      console.error("Login Error:", err);

      // ✅ proper error handling
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password");
        } else {
          setError(`Error: ${err.response.status}`);
        }
      } else {
        setError("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "400px" }}>
        <h2 className="title">Login</h2>

        <p style={{ textAlign: "center", color: "#64748b" }}>
          Please login to continue
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          {/* 👁️ Password toggle */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ paddingRight: "40px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "14px",
                color: "#6366f1"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            className="btn"
            type="submit"
            style={{ width: "100%", marginTop: "15px" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="no-data">{error}</p>}
      </div>
    </div>
  );
};

export default Login;