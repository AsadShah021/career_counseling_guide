import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Signup.css";

const Signup = ({ onClose, openLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage("Signup successful! Redirecting to login...");

      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        if (onClose) onClose();
        if (openLogin) openLogin();
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error signing up");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name } = decoded;

      await axios.post("http://localhost:5000/api/auth/google-signup", { email, name });

      setMessage("Google Signup successful! Redirecting to login...");
      setTimeout(() => {
        if (onClose) onClose();
        if (openLogin) openLogin();
      }, 1500);
    } catch (error) {
      console.error("Google Signup Error:", error);
      setMessage("Google signup failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Sign Up</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Name</label>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Email</label>
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

          <button type="submit" className="btn-submit">Sign Up</button>
        </form>

        <div className="google-login" style={{ marginTop: "15px" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google signup failed")}
          />
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
