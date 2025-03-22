import React, { useState } from "react";
import axios from "axios";
import "./Signup.css"; // Import external CSS for modal styling
import Login from "../LoginPage/Login"; // Import the Login component

const Signup = ({ onClose, openLogin }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState(""); // Message for success or error

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle signup submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
            setMessage("Signup successful! Redirecting to login...");
            
            // Clear form after successful signup
            setFormData({ name: "", email: "", password: "" });

            // Delay before switching to login modal
            setTimeout(() => {
                if (onClose) onClose(); // Close signup modal
                if (openLogin) openLogin(); // Open login modal
            }, 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error signing up");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button type="button" className="close-btn" onClick={onClose}>
                    &times;
                </button>

                <h2 className="modal-title">Sign Up</h2>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Name Field */}
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

                    {/* Email Field */}
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

                    {/* Password Field */}
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

                {/* Display Success/Error Message */}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Signup;
