const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Manual Admin Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const admin = new Admin({ name, email, password });
    await admin.save();
    res.status(201).json({ message: "Admin created" });
  } catch (error) {
    console.error("Manual Admin Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Google Admin Signup with Debugging
router.post("/google-signup", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Missing credential in request body" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    console.log("✅ Google payload decoded:", { name, email });

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({ name, email, password: "google-oauth" });
    await admin.save();
    console.log("✅ Admin saved:", admin);

    res.status(201).json({ message: "Google Admin created" });
  } catch (error) {
    console.error("Google Admin Signup Error:", error);
    res.status(400).json({ message: "Google signup failed", error: error.message });
  }
});

// Optional: Get all admin users (for admin dashboard)
router.get("/users", async (req, res) => {
  try {
    const users = await Admin.find({}, "name email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins", error: err.message });
  }
});

module.exports = router;
