const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Store codes temporarily (in-memory)
const verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Step 1: Send Verification Code
router.post("/request-verification", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  verificationCodes[email] = {
    code,
    name,
    password,
    expires: Date.now() + 5 * 60 * 1000,
  };

  const mailOptions = {
    from: `"Career Guide" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Hello ${name},\n\nYour verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification code sent to email." });
  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// Step 2: Verify Code
router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];

  if (!record || Date.now() > record.expires || parseInt(code) !== record.code) {
    return res.status(400).json({ success: false, message: "Invalid or expired code." });
  }

  // ✅ Account creation would go here (e.g., save to DB)
  console.log("Verified user:", record.name, email);

  delete verificationCodes[email]; // cleanup

  res.json({ success: true, message: "Email verified. Account created." });
});

module.exports = router;
