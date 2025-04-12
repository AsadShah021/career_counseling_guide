const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact"); // Import Contact model

// Handle Contact Form Submission
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate inputs
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Save to MongoDB
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: "Message saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
