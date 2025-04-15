import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function NavbarVisibility({ isAuthenticated }) {
  const location = useLocation();

  // Hide navbar for unauthenticated users or on landing/root page
  if (!isAuthenticated || location.pathname === "/" || location.pathname === "/landing") {
    return null;
  }

  return <Navbar />;
}

export default NavbarVisibility;
