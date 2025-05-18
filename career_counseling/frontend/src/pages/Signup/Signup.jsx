import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import eyeVisible from "../../assets/eye-visible.png";
import eyeHidden from "../../assets/eye-hidden.png";
import "./Signup.css";

const Signup = ({ onClose, openLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const hasSQLInjectionChars = (input) => /['";]/.test(input);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      const { name, email, password } = formData;

      if (!name.trim()) return setMessage("Name is required.");
      if (!isValidEmail(email)) return setMessage("Invalid email format.");
      if (!isStrongPassword(password)) return setMessage("Password must be 8+ characters with uppercase, lowercase, and number.");
      if (hasSQLInjectionChars(name) || hasSQLInjectionChars(email) || hasSQLInjectionChars(password)) return setMessage("Suspicious input detected.");

      setLoading(true);
      setMessage("");

      try {
        const res = await axios.post("http://localhost:5000/api/auth/request-verification", formData);
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
      try {
        setLoading(true);
        const res = await axios.post("http://localhost:5000/api/auth/verify-code", {
          email: formData.email,
          code,
        });

        if (res.data.success) {
          toast.success("Signup successful! Redirecting...");
          setTimeout(() => {
            onClose?.();
            openLogin?.();
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
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name } = decoded;

      await axios.post("http://localhost:5000/api/auth/google-signup", { email, name });

      toast.success("Google signup successful! Redirecting...");
      setTimeout(() => {
        onClose?.();
        openLogin?.();
      }, 1500);
    } catch (error) {
      toast.error("Google signup failed.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Sign Up</h2>

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

              <div className="form-group password-group">
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
                />
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
                  placeholder="Enter verification code"
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
          <div className="google-login" style={{ marginTop: "15px" }}>
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

export default Signup;
