const mongoose = require("mongoose");

// Contact Schema with support for reply tracking
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  replyMessage: {
    type: String,
    default: "" // Stores admin's reply
  },
  replied: {
    type: Boolean,
    default: false // Status of reply
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Contact", ContactSchema);
