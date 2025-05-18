import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/LandingPage/Landing";
import HomePage from "./pages/HomePage/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminSignUp from "./pages/AdminSignUp/AdminSignUp";

import LayoutWithFooter from "./components/LayoutWithFooter";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* Public - No Footer */}
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

          {/* Public Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />

          {/* Protected Routes with Footer */}
          <Route element={<LayoutWithFooter isAuthenticated={isAuthenticated} />}>
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
          </Route>
        </Routes>

        {/* Global Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
