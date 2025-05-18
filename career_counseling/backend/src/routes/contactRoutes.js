const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Save Contact Message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newContact = new Contact({
      name,
      email,
      message,
      replied: false,
      replyMessage: ""
    });

    await newContact.save();
    res.status(201).json({ message: "Message saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Fetch All Contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contacts", error: err.message });
  }
});

// ✅ Reply to Contact Message & Save Reply Message
router.post("/reply", async (req, res) => {
  const { email, message, contactId } = req.body;

  if (!email || !message || !contactId) {
    return res.status(400).json({ message: "Email, message, and contactId are required" });
  }

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Original contact message not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const composedEmail = `
Hello ${contact.name},

This is a response to your message:

🟡 Your Message:
----------------
${contact.message}

🟢 Admin Reply:
----------------
${message}

Regards,  
Career Guide Admin Team
    `;

    await transporter.sendMail({
      from: `"Admin Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reply to Your Career Guide Message",
      text: composedEmail,
      html: `
        <p>Hello <strong>${contact.name}</strong>,</p>
        <p>This is a response to your message:</p>
        <hr/>
        <p><strong> Your Message:</strong><br/>${contact.message}</p>
        <hr/>
        <p><strong> Admin Reply:</strong><br/>${message}</p>
        <br/>
        <p>Regards,<br/><strong>Career Guide Admin Team</strong></p>
      `
    });

    await Contact.findByIdAndUpdate(contactId, {
      replied: true,
      replyMessage: message
    });

    res.status(200).json({ message: "Reply sent and saved successfully" });
  } catch (error) {
    console.error("Email sending error:", error.stack || error.message);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});

// ✅ Soft Delete Reply Only
router.patch("/delete-reply", async (req, res) => {
  const { contactId } = req.body;

  if (!contactId) {
    return res.status(400).json({ message: "Contact ID is required" });
  }

  try {
    await Contact.findByIdAndUpdate(contactId, {
      replied: false,
      replyMessage: ""
    });

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Delete reply error:", error.stack || error.message);
    res.status(500).json({ message: "Failed to delete reply", error: error.message });
  }
});

// ✅ Hard Delete Entire Contact Message
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error.stack || error.message);
    res.status(500).json({ message: "Failed to delete contact", error: error.message });
  }
});

// ✅ Test Email Route
router.get("/test-mail", async (req, res) => {
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
      subject: "Test Email from Admin Panel",
      text: "✅ This is a test message from Nodemailer setup.",
    });

    res.send("✅ Test email sent successfully!");
  } catch (error) {
    console.error("Nodemailer Test Error:", error.stack);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
