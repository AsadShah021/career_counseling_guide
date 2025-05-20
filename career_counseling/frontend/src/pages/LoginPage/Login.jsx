import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import eyeHidden from "../../assets/eye-hidden.png";
import eyeVisible from "../../assets/eye-visible.png";
import "./Login.css";

const Login = ({ onClose, setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const hasSQLInjectionChars = (input) => {
    const lower = input.toLowerCase();
    return /['";]/.test(input) || lower.includes("--") || lower.includes(" or ") || lower.includes(" drop ") || lower.includes(" select ");
  };

  const showToast = (msg, duration = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(""), duration);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!isValidEmail(email)) return setMessage("Invalid email format.");
    if (!isStrongPassword(password)) return setMessage("Password must be 8+ chars with upper, lower, digit.");
    if (hasSQLInjectionChars(email) || hasSQLInjectionChars(password)) return setMessage("Suspicious input detected.");

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const decoded = jwtDecode(response.data.token);
      const { name, email: userEmail } = response.data.user;
      const { role } = response.data;

      localStorage.setItem("user", JSON.stringify({ token: response.data.token, name, email: userEmail, role }));

      setIsAuthenticated(true);
      showToast("Login successful!");

      setTimeout(() => {
        onClose();
        navigate(role === "admin" ? "/admin" : "/home");
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed.");
      showToast("Login failed!");
    } finally {
      setLoading(false);
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

      localStorage.setItem("user", JSON.stringify({ token: response.data.token, name, email, role }));
      setIsAuthenticated(true);
      showToast("Google Login successful!");

      setTimeout(() => {
        onClose();
        navigate(role === "admin" ? "/admin" : "/home");
      }, 1000);
    } catch (error) {
      setMessage("Google login failed.");
      showToast("Google login failed.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      if (step === 1) {
        await axios.post("http://localhost:5000/api/auth/request-password-reset", { email: resetEmail });
        setStep(2);
        setMessage("Code sent to email.");
      } else {
        await axios.post("http://localhost:5000/api/auth/reset-password", { email: resetEmail, code: resetCode, newPassword });
        setMessage("Password reset successful.");
        setTimeout(() => {
          setShowForgot(false);
          setStep(1);
        }, 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">{showForgot ? "Reset Password" : "Login"}</h2>

        {!showForgot ? (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required />
              <label>Email address</label>
            </div>
<div className="form-group password-group" style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder=" "
    required
  />
  <label>Password</label>
  <img
    src={showPassword ? eyeVisible : eyeHidden}
    alt="Toggle Password"
    className="toggle-eye"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
      cursor: "pointer",
      width: "20px",
      height: "20px"
    }}
  />
</div>

            <p className="forgot-link" onClick={() => setShowForgot(true)}>Forgot Password?</p>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="modal-form">
            {step === 1 ? (
              <div className="form-group">
                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder=" " required />
                <label>Email to reset</label>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder=" " required />
                  <label>Verification Code</label>
                </div>
                <div className="form-group">
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder=" " required />
                  <label>New Password</label>
                </div>
              </>
            )}
            <button type="submit" className="btn-submit">{step === 1 ? "Send Reset Code" : "Reset Password"}</button>
            <p className="forgot-link" onClick={() => { setShowForgot(false); setStep(1); }}>← Back to Login</p>
          </form>
        )}

        {!showForgot && (
          <div className="google-login">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => showToast("Google login failed.")} />
          </div>
        )}

        {message && <p className="message">{message}</p>}
        {toast && <div className="custom-toast">{toast}</div>}
      </div>
    </div>
  );
};

export default Login;
