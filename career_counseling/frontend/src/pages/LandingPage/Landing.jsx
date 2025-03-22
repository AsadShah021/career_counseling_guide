import React, { useState } from "react";
import Signup from "../Signup/Signup";
import Login from "../LoginPage/Login";
import "./Landing.css";

const Landing = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="landing-container">
      {/* Left Section with Video */}
      <div className="left-section">
        <video autoPlay loop muted className="background-video">
          <source src="/assets/Animation - 1742379380832.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Section with Buttons & Content */}
      <div className="right-section">
        {/* Buttons at Top-Right */}
        <div className="buttons-container">
          <button className="btn" onClick={() => setShowLogin(true)}>Login</button>
          <button className="btn signup-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>

        {/* Dummy Text with Smooth Transition */}
        <div className="content">
          <h1>Welcome to Our Platform</h1>
          <p>
            Discover amazing features and enjoy a seamless experience. 
            Sign up today to explore more.
          </p>
        </div>
      </div>

      {/* Signup Modal (Closes & Opens Login on Success) */}
      {showSignup && (
        <Signup 
          onClose={() => setShowSignup(false)} 
          openLogin={() => setShowLogin(true)} 
        />
      )}

      {/* Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Landing;
