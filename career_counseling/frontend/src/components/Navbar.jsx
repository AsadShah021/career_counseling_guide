import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "/logo_02.png"; // Import logo

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <NavLink to="/" className="nav-logo">
          <img src={logo} alt="Career Guide Logo" className="logo-img" />
        </NavLink>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" exact className="nav-link" activeClassName="active">Home</NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className="nav-link" activeClassName="active">Analytics</NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link" activeClassName="active">About Us</NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav-link" activeClassName="active">Contact Us</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
