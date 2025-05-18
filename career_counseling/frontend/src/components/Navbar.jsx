import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "/logo_02.png";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const profileIcon = "/assets/logo/icons8-circled-user-male-skin-type-4.gif";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      fetch("http://localhost:5000/api/admin")
        .then((res) => res.json())
        .then((data) => {
          const isAdminUser = data.some((admin) => admin.email === user.email);
          setIsAdmin(isAdminUser);
        })
        .catch((err) => console.error("Admin check failed:", err));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Simulate async logout delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/home" className="nav-logo">
          <img src={logo} alt="Career Guide Logo" className="logo-img" />
        </NavLink>

        <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          &#9776;
        </button>

        <div className={`nav-content ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li><NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
            <li><NavLink to="/analytics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Analytics</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About Us</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact Us</NavLink></li>
          </ul>

          <div className="profile-dropdown" ref={dropdownRef}>
            <img
              src={profileIcon}
              alt="Profile"
              className="profile-icon-img"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                {isAdmin && (
                  <button onClick={() => navigate("/admin")}>Admin Dashboard</button>
                )}
                <button onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? <div className="logout-spinner" /> : "Sign Out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
