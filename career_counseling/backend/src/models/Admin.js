const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String, // "google-oauth" or hashed
  },
  {
    collection: "admin", // ✅ Force collection name to match MongoDB
  }
);

module.exports = mongoose.model("Admin", adminSchema);
