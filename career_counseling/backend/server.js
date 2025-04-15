const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// ✅ Check if GOOGLE_CLIENT_ID is loaded
if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn("⚠️ GOOGLE_CLIENT_ID is not set in .env");
}

// ✅ MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB Connected Successfully");
}).catch((error) => {
  console.error("❌ MongoDB Connection Failed:", error);
});

// ✅ Import Routes
const authRoutes = require("./src/routes/authRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// ✅ Route Registration
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Default route (optional)
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
