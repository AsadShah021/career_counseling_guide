import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onClose }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // For navigation

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle login submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email: formData.email, 
                password: formData.password
            });
    
            setMessage("Login Successful!");
            localStorage.setItem("user", JSON.stringify(response.data));
    
            setTimeout(() => {
                onClose();
                navigate("/home");
            }, 1500);
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            setMessage(error.response?.data?.message || "Login Failed!");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button type="button" className="close-btn" onClick={onClose}>
                    &times;
                </button>

                <h2 className="modal-title">Login</h2>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Email Input with Floating Label */}
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

                    {/* Password Input with Floating Label */}
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

                    {/* Submit Button */}
                    <button type="submit" className="btn-submit">Login</button>
                </form>

                {/* Display Success/Error Message */}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;
