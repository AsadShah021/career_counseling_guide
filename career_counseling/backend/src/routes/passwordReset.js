const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");

const resetCodes = {}; // temp in-memory store

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Send Reset Code
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found." });

  const code = Math.floor(100000 + Math.random() * 900000);
  resetCodes[email] = {
    code,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    await transporter.sendMail({
      from: `"Career Guide" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your Career Guide password reset code is: ${code}\nThis code will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "Reset code sent to email." });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ message: "Failed to send reset email." });
  }
});

// 🔹 Verify Code & Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  const record = resetCodes[email];

  if (!record || parseInt(code) !== record.code || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired code." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.password = newPassword; // will be hashed automatically via pre-save
    await user.save();

    delete resetCodes[email];
    res.json({ success: true, message: "Password reset successful." });
  } catch (err) {
    console.error("❌ Reset error:", err);
    res.status(500).json({ message: "Could not reset password." });
  }
});

module.exports = router;
