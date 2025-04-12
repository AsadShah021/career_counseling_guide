const mongoose = require("mongoose");

// Define Contact Schema
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create and export the model
module.exports = mongoose.model("Contact", ContactSchema);
