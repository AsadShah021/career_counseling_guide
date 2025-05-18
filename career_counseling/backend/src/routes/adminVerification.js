const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Admin = require("../models/Admin"); // Make sure you have this model

const verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Step 1: Send code to admin
router.post("/request-verification", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(409).json({ success: false, message: "Email already registered as admin." });
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  verificationCodes[email] = {
    code,
    name,
    password,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    await transporter.sendMail({
      from: `"Career Guide Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Admin Email Verification",
      text: `Hello ${name},\n\nYour verification code is: ${code}\nExpires in 5 mins.`,
    });

    res.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// Step 2: Verify admin code and save to admin collection
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];

  if (!record) {
    return res.status(400).json({ success: false, message: "No verification initiated for this email." });
  }

  if (parseInt(code) !== record.code || Date.now() > record.expires) {
    return res.status(400).json({ success: false, message: "Invalid or expired code." });
  }

  try {
    const newAdmin = new Admin({
      name: record.name,
      email,
      password: record.password,
      role: "admin",
    });

    await newAdmin.save();
    delete verificationCodes[email];

    res.json({ success: true, message: "Admin account created." });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ success: false, message: "Failed to create admin." });
  }
});

module.exports = router;
