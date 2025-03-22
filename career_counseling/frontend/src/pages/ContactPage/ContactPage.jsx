import React from "react";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-us-page">
      <div className="contact-container">
        <h1>Let’s Connect</h1>
        <form className="contact-form">
          <input type="text" id="name" name="name" placeholder="Name" required />
          <input type="email" id="email" name="email" placeholder="Email" required />
          <textarea id="message" name="message" rows="5" placeholder="Message" required></textarea>
          <button type="submit" className="send-button">
            Send <span className="arrow">&gt;</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
