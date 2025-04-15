const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET all users (only name and email)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1 }); // Only return name and email
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ DELETE user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
