const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Login Route


router.post("/login", async (req, res) => {
    try {
        console.log("Received Login Request:", req.body); // Debugging log

        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if password matches
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
