const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ JWT Token Generator
const generateToken = (user, role) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// ✅ User Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Manual Login (Admin → User fallback)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Check Admin first
    const admin = await Admin.findOne({ email, password });
    if (admin) {
      const token = generateToken(admin, "admin");
      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: { name: admin.name, email: admin.email },
        role: "admin",
      });
    }

    // 🔍 Check User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user, "user");
    res.status(200).json({
      message: "User login successful",
      token,
      user: { name: user.name, email: user.email },
      role: "user",
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Google Login (Admin → User fallback)
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // 🔍 Check Admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      const token = generateToken(admin, "admin");
      return res.status(200).json({
        message: "Admin Google login successful",
        token,
        user: { name: admin.name, email: admin.email },
        role: "admin",
      });
    }

    // 🔍 Check User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "User not registered. Please sign up first.",
      });
    }

    const token = generateToken(user, "user");
    res.status(200).json({
      message: "User Google login successful",
      token,
      user: { name: user.name, email: user.email },
      role: "user",
    });
  } catch (error) {
    console.error("Google Login Error:", error.message);
    res.status(400).json({ message: "Google login failed", error: error.message });
  }
});

// ✅ Google Signup (User only)
router.post("/google-signup", async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists. Please login instead.",
      });
    }

    user = new User({ name, email, password: "google-oauth" });
    await user.save();

    res.status(201).json({ message: "Google signup successful!" });
  } catch (error) {
    console.error("Google Signup Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
