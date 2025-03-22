import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/LandingPage/Landing";
import HomePage from "./pages/HomePage/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check localStorage for user authentication on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Ensure first-time visit always lands on Landing Page
  }, []);

  if (loading) {
    return null; // Prevents redirection before auth state is determined
  }

  return (
    <Router>
      {/* Show Navbar only if authenticated */}
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Ensure Landing Page loads first on initial visit */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Landing setIsAuthenticated={setIsAuthenticated} />
          }
        />

        {/* Home Page only accessible after login */}
        <Route
          path="/landing"
          element={isAuthenticated ? <Landing /> : <Navigate to="/" replace />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/analytics"
          element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/about"
          element={isAuthenticated ? <AboutPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/contact"
          element={isAuthenticated ? <ContactPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
