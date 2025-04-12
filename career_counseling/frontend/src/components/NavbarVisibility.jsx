import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function NavbarVisibility({ isAuthenticated }) {
  const location = useLocation();

  // If user isn't authenticated, or we are on the landing page routes, return nothing
  if (!isAuthenticated) return null;

  // Hide navbar on root "/" and "/landing"
  if (location.pathname === "/" || location.pathname === "/landing") {
    return null;
  }

  // Otherwise, show the navbar
  return <Navbar />;
}

export default NavbarVisibility;
