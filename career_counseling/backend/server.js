const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Debug: Environment variable checks
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER ? "Loaded" : "❌ Missing");
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "❌ Missing");
console.log("✅ GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Loaded" : "❌ Missing");

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((error) => console.error("❌ MongoDB Connection Failed:", error));

// ✅ Import Routes
const authRoutes = require("./src/routes/authRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes"); // ✅ Ensure correct path

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); // ✅ DELETE /api/admin/:id handled here

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ✅ Email Testing Route
const nodemailer = require("nodemailer");

app.get("/api/contact/test-mail", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Test" <${process.env.EMAIL_USER}>`,
      to: "your-personal-email@gmail.com", // 🔁 Replace for real test
      subject: "✅ Nodemailer Test Email",
      text: "🎉 If you're reading this, email config works perfectly.",
    });

    res.send("✅ Test email sent successfully!");
  } catch (error) {
    console.error("❌ Nodemailer Test Error:", error.stack);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
