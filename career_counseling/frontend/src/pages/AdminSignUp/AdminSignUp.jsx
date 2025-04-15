import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import "./AdminSignUp.css";

const AdminSignUp = ({ onClose }) => {
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
      const res = await axios.post("http://localhost:5000/api/admin/signup", formData);
      if (res.status === 201) {
        setMessage("✅ Admin signup successful!");
        setFormData({ name: "", email: "", password: "" });

        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        setMessage("⚠️ Signup failed. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Error signing up as admin");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;

      const res = await axios.post("http://localhost:5000/api/admin/google-signup", {
        credential,
      });

      if (res.status === 201) {
        setMessage("✅ Google Admin Signup successful!");
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        setMessage("⚠️ Unexpected response from server.");
      }
    } catch (error) {
      console.error("Google Admin Signup Error:", error);
      setMessage("❌ Google admin signup failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Admin Sign Up</h2>
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
          <button type="submit" className="btn-submit">
            Sign Up
          </button>
        </form>

        <div className="google-login">
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

export default AdminSignUp;
