import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = ({ onClose, setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const decoded = jwtDecode(response.data.token);
      const { name, email } = response.data.user;
      const { role } = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: response.data.token,
          name,
          email,
          role,
        })
      );

      setIsAuthenticated(true);
      setMessage(`${role === "admin" ? "Admin" : "User"} Login Successful!`);

      setTimeout(() => {
        onClose();
        navigate(role === "admin" ? "/admin" : "/home");
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login Failed!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/google-login", {
        credential: credentialResponse.credential,
      });

      const decoded = jwtDecode(response.data.token);
      const { name, email } = response.data.user;
      const { role } = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: response.data.token,
          name,
          email,
          role,
        })
      );

      setIsAuthenticated(true);
      setMessage("Google Login Successful!");

      setTimeout(() => {
        onClose();
        navigate(role === "admin" ? "/admin" : "/home");
      }, 1000);
    } catch (error) {
      console.error("Google Login Error:", error);
      setMessage("Google login failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Login</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Email address</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Password</label>
          </div>

          <button type="submit" className="btn-submit">Login</button>
        </form>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google login failed")}
          />
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
