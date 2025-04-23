import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-section">
          <h2>Career Guide</h2>
          <p>Empowering students to make informed decisions about their future.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/analytics">Analytics</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@careerguide.com</p>
          <p>Phone: +92 300 1234567</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Career Guide. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
