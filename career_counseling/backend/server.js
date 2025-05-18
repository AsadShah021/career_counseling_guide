const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const nodemailer = require("nodemailer");
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
const adminRoutes = require("./src/routes/adminRoutes");
const emailVerificationRoutes = require("./src/routes/emailVerification");
const passwordResetRoutes = require("./src/routes/passwordReset");
const adminVerificationRoutes = require("./src/routes/adminVerification"); // ✅ FIXED

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", emailVerificationRoutes); // ✅ FIXED
app.use("/api/auth", passwordResetRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminVerificationRoutes); // ✅ FIXED

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ✅ Email Test Route
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
      to: "your-personal-email@gmail.com",
      subject: "✅ Nodemailer Test Email",
      text: "🎉 If you're reading this, email config works perfectly.",
    });

    res.send("✅ Test email sent successfully!");
  } catch (error) {
    console.error("❌ Nodemailer Test Error:", error.stack);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Predict Merit Route
const upload = multer({ dest: "uploads/" });

app.post("/api/predict-merit", upload.single("file"), (req, res) => {
  const filePath = path.resolve(req.file.path);
  const year = req.body.year;

  const python = spawn("python", ["predict_merit.py", filePath, year]);

  let result = "";
  let errorOccurred = false;

  python.stdout.on("data", (data) => {
    const output = data.toString().trim();
    console.log("🟢 Python Output:", output);
    result += output;
  });

  python.stderr.on("data", (data) => {
    errorOccurred = true;
    console.error("❌ Python stderr:", data.toString());
  });

  python.on("close", (code) => {
    if (code === 0 && !errorOccurred) {
      if (result.includes("already exists")) {
        return res.status(409).json({ message: `Prediction for year ${year} already exists.` });
      } else if (result.includes("invalid year")) {
        return res.status(400).json({ message: `Invalid year. Only ${parseInt(year) - 1 + 1} is allowed.` });
      }

      const outputPath = result.trim();
      return res.status(200).json({
        message: `✅ Merit prediction completed successfully for ${year}.`,
        savedTo: outputPath,
        url: "/data/Merit_Predictions.json"
      });
    } else {
      return res.status(500).json({ error: "❌ Prediction script failed." });
    }
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
