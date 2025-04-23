import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "../Signup/Signup";
import Login from "../LoginPage/Login";
import "./Landing.css";
import { Typewriter } from "react-simple-typewriter";

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
  const [showParagraph, setShowParagraph] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => setShowParagraph(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-container">
      {/* Left Section with Carousel */}
      <div className="left-section">
        <div className="carousel fade-carousel">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className={`carousel-slide fade ${index === currentImageIndex ? "active" : ""}`}
            />
          ))}
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
          <button className="btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button className="btn signup-btn" onClick={() => setShowSignup(true)}>
            Sign Up
          </button>
        </div>

        <div className="content slide-down">
          <h1 style={{
            fontFamily: 'Segoe UI, sans-serif',
            fontSize: '2.4rem',
            fontWeight: 'bold',
            color: '#1f1f1f'
          }}>
            <Typewriter
              words={["Welcome to Our Platform"]}
              cursor
              cursorColor="#007bff"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h1>

          {showParagraph && (
            <p className="fade-in" style={{ fontSize: "1.2rem", textAlign: "justify", color: "#555", marginTop: "1rem" }}>
              <Typewriter
                words={[`Choosing the right career is one of the most important decisions in a student's life. Our career counseling platform is designed to help students in Pakistan find the best field based on their marks, interests, and future opportunities. We provide expert advice, university admission details, and insights into different career paths to make this decision easier for you. With our platform, students can explore field trends, compare different options, and access university application links all in one place. Our goal is to guide students toward a successful future by providing the right information at the right time. Start your journey with us today and take the first step toward a bright career!`]}
                cursor
                cursorStyle="_"
                typeSpeed={20}
                delaySpeed={500}
              />
            </p>
          )}
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
