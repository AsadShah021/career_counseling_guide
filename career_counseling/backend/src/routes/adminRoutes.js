const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Manual Admin Signup
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

// ✅ Google Admin Signup
router.post("/google-signup", async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({ name, email, password: "google-oauth" });
    await admin.save();
    res.status(201).json({ message: "Google Admin created" });
  } catch (error) {
    console.error("Google Admin Signup Error:", error.message);
    res.status(400).json({ message: "Google signup failed", error: error.message });
  }
});

// ✅ Get all admin users
router.get("/users", async (req, res) => {
  try {
    const users = await Admin.find({}, "name email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins", error: err.message });
  }
});

// ✅ Delete an admin (with ObjectId validation and protection)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🧹 Admin delete request for ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid admin ID." });
    }

    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins <= 1) {
      return res.status(400).json({ message: "Cannot delete the last remaining admin." });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found or already deleted." });
    }

    console.log("✅ Admin deleted:", deletedAdmin.email);
    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("❌ Admin Delete Error:", error.message);
    res.status(500).json({ message: "Failed to delete admin", error: error.message });
  }
});

module.exports = router;
