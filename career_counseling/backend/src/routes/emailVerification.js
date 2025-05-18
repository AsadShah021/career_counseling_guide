const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User"); // ✅ Import your User model

const verificationCodes = {}; // In-memory temporary store

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send Verification Code
router.post("/request-verification", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: "Email already registered." });
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  verificationCodes[email] = {
    code,
    name,
    password,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  try {
    await transporter.sendMail({
      from: `"Career Guide" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      text: `Hello ${name},\n\nYour verification code is: ${code}\nThis code will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "Verification code sent to your email." });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ success: false, message: "Failed to send verification email." });
  }
});

// ✅ Verify Code and Create User
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];

  if (!record) {
    return res.status(400).json({ success: false, message: "No verification request found for this email." });
  }

  if (parseInt(code) !== record.code || Date.now() > record.expires) {
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  try {
    const newUser = new User({
      name: record.name,
      email: email,
      password: record.password, // 🔒 Password will be hashed in pre('save')
    });

    await newUser.save();
    delete verificationCodes[email];

    res.json({ success: true, message: "Email verified and account created successfully." });
  } catch (err) {
    console.error("❌ User creation error:", err);
    res.status(500).json({ success: false, message: "Failed to create user." });
  }
});

module.exports = router;
