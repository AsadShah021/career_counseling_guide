import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavbarVisibility from "./components/NavbarVisibility";

 // the helper component
import Landing from "./pages/LandingPage/Landing";
import HomePage from "./pages/HomePage/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <Router>
      {/* Instead of isAuthenticated && <Navbar /> */}
      <NavbarVisibility isAuthenticated={isAuthenticated} />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Landing setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/landing"
          element={
            isAuthenticated ? (
              <Landing />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <HomePage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            isAuthenticated ? (
              <AnalyticsPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/about"
          element={
            isAuthenticated ? (
              <AboutPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/contact"
          element={
            isAuthenticated ? (
              <ContactPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
