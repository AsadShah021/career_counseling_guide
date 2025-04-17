import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "../Signup/Signup";
import Login from "../LoginPage/Login";
import "./Landing.css";

// Import images
import img1 from "../../assets/career_logo.png";
import img2 from "../../assets/logo_02.png";
import img3 from "../../assets/logo_03.png";
import img4 from "../../assets/logo_04.png";
import img5 from "../../assets/logo_05.png";

const Landing = ({ setIsAuthenticated }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4, img5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.token) {
        setIsAuthenticated(true);
      }
    }
  }, [setIsAuthenticated]);

  return (
    <div className="landing-container">
      {/* Left Section with Carousel */}
      <div className="left-section">
        <div className="carousel">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index}`}
                className="carousel-slide"
              />
            ))}
          </div>
          <div className="carousel-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="buttons-container">
          <button className="btn" onClick={() => setShowLogin(true)}>Login</button>
          <button className="btn signup-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>

        <div className="content">
          <h1>Welcome to Our Platform</h1>
          <p>
            Choosing the right career is one of the most important decisions in
            a student's life. Our career counseling platform is designed to help
            students in Pakistan find the best field based on their marks,
            interests, and future opportunities. We provide expert advice,
            university admission details, and insights into different career
            paths to make this decision easier for you. With our platform,
            students can explore field trends, compare different options, and
            access university application links all in one place. Our goal is to
            guide students toward a successful future by providing the right
            information at the right time. Start your journey with us today and
            take the first step toward a bright career!
          </p>
        </div>
      </div>

      {/* Modals */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          openLogin={() => setShowLogin(true)}
        />
      )}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
    </div>
  );
};

export default Landing;
