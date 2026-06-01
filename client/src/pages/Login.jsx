import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/Toast";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Enter a valid email";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/user/login",
        formData
      );

      localStorage.setItem(
        "access_token",
        res.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.result)
      );

      showToast("Login Successful", "success");

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>

        <p className="subtitle">
          Login to continue your journey
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="register-link">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;