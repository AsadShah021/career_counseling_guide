import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import * as jwtLib from "jwt-decode";
const jwtDecode = jwtLib.default || jwtLib;
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminSignUp.css";

const AdminSignUp = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const hasSQLInjectionChars = (input) => /['";]/.test(input);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (step === 1) {
      const { name, email, password } = formData;
      if (!name.trim()) return setMessage("Name is required.");
      if (!isValidEmail(email)) return setMessage("Invalid email format.");
      if (!isStrongPassword(password))
        return setMessage(
          "Password must be 8+ chars, including uppercase, lowercase & number."
        );
      if (hasSQLInjectionChars(name + email + password))
        return setMessage("Suspicious input detected.");

      setLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:5000/api/admin/request-verification",
          { name, email, password, role: "admin" }
        );
        if (res.data.success) {
          toast.success("Verification code sent to your email.");
          setStep(2);
        } else {
          toast.error(res.data.message || "Failed to send code.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error sending code.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:5000/api/admin/verify-code",
          { email: formData.email, code, role: "admin" }
        );
        if (res.data.success) {
          toast.success("Admin account created. Redirecting...");
          setTimeout(() => {
            navigate("/admin");
            onClose();
          }, 1500);
        } else {
          toast.error(res.data.message || "Verification failed.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Verification error.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { email, name } = jwtDecode(credentialResponse.credential);
      await axios.post(
        "http://localhost:5000/api/admin/google-signup",
        { email, name, role: "admin" }
      );
      toast.success("Google Admin signup successful! Redirecting...");
      setTimeout(() => {
        navigate("/admin-dashboard");
        onClose();
      }, 1500);
    } catch {
      toast.error("Google signup failed.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Admin Sign Up</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          {step === 1 ? (
            <>
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

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder=" "
                  required
                />
                <label>Verification Code</label>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Sign Up"}
              </button>
            </>
          )}
        </form>

        {step === 1 && (
          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google signup failed.")}
            />
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminSignUp;
