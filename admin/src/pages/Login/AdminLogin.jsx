import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { assets } from "../../assets/admin_assets/assets";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔒 STATIC ADMIN CREDENTIALS
  const ADMIN_EMAIL = "admin@foodhub.com";
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      navigate("/"); // Admin dashboard route
    } else {
      alert("❌ Invalid Admin Credentials");
    }
  };

  return (
    <div className="admin-login">
      {/* 🔥 FoodHub Logo */}
      <div className="admin-logo">
        {/* <img src={assets.logo} alt="FoodHub Logo" /> */}
        <span>FoodHub Admin</span>
      </div>

      {/* 🔐 Login Card */}
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
