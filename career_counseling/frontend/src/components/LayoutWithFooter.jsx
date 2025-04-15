// src/components/LayoutWithFooter.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarVisibility from "./NavbarVisibility";
import Footer from "./Footer";
import "./LayoutWithFooter.css"; // optional if using separate styles

const LayoutWithFooter = ({ isAuthenticated }) => {
  return (
    <div className="page-layout">
      <NavbarVisibility isAuthenticated={isAuthenticated} />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutWithFooter;
