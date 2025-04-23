import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import logoutIcon from "../../assets/logout-icon.png";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reply, setReply] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
    fetchContacts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contact");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
        });
        if (res.ok) fetchUsers();
        else alert("Failed to delete user.");
      } catch (error) {
        console.error("Delete User Error:", error);
      }
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (admins.length <= 1) {
      alert("⚠️ Cannot delete the last remaining admin.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this admin account?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/admin/${id}`);
        alert("✅ Admin deleted successfully.");
        fetchAdmins();
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          `Error code: ${error.response?.status}`;
        console.error("Admin Delete Error:", error);
        alert(`❌ Failed to delete admin: ${message}`);
      }
    }
  };

  const handleReplyChange = (id, value) => {
    setReply((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = async (email, id) => {
    const message = reply[id]?.trim();
    const contact = contacts.find((c) => c._id === id);
    if (!message) return alert("Please type a reply.");

    const composedMessage = message; // Only admin reply gets stored


    try {
      const res = await axios.post("http://localhost:5000/api/contact/reply", {
        email,
        message: composedMessage,
        contactId: id,
        replyMessage: message,
      });

      if (res.status === 200) {
        alert("Reply sent successfully!");
        setReply((prev) => ({ ...prev, [id]: "" }));
        fetchContacts();
      } else {
        alert("Failed to send reply");
      }
    } catch (error) {
      console.error("Send Reply Error:", error);
      alert("Error sending reply");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this contact message?")
    )
      return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/contact/${id}`);
      if (res.status === 200) {
        alert("Contact message deleted successfully!");
        fetchContacts();
      } else {
        alert("Failed to delete message");
      }
    } catch (error) {
      console.error("Delete Message Error:", error);
      alert("Error deleting message");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <div className="top-controls">
        <button
          className="auth-btn signup-btn"
          onClick={() => navigate("/admin/signup")}
        >
          Admin Signup
        </button>
        <img
          src={logoutIcon}
          alt="Logout"
          title="Logout"
          onClick={handleLogout}
          className="logout-icon"
        />
      </div>

      <h2 className="section-heading">📋 Registered Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-heading">🗡️ Admin Accounts</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin._id}>
              <td>{index + 1}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAdmin(admin._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-heading">📨 Contact Messages</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th className="message-col">Message</th>
            <th>Status</th>
            <th className="reply-col">Reply</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact._id}>
              <td>{index + 1}</td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td className="message-col">{contact.message}</td>
              <td>{contact.replied ? "✅ Replied" : "⏳ Pending"}</td>
              <td className="reply-col">
                {contact.replied ? (
                  <div className="reply-wrapper">
                    <div className="user-reply">{contact.replyMessage}</div>
                    <div className="reply-btn-container">
                      <button
                        className="reply-delete-btn"
                        onClick={() => handleDeleteMessage(contact._id)}
                        title="Delete Message"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="reply-textarea"
                      rows="4"
                      value={reply[contact._id] || ""}
                      onChange={(e) =>
                        handleReplyChange(contact._id, e.target.value)
                      }
                      placeholder="Type reply here"
                    ></textarea>
                    <br />
                    <button
                      className="auth-btn user-btn"
                      onClick={() =>
                        handleSendReply(contact.email, contact._id)
                      }
                      style={{ marginTop: "5px" }}
                    >
                      Send Reply
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔮 Predict Merit Section */}
      <div className="predict-merit-section">
        <h2 className="section-heading">🔮 Predict University Merit</h2>

        {loading ? (
          <div className="loader-message">
            <div className="spinner"></div>
            <p style={{ marginTop: "10px" }}>
              🔄 Predicting merit... please wait
            </p>
          </div>
        ) : (
          <div className="predict-form-container">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const file = e.target.file.files[0];
                const year = e.target.year.value;

                if (!file || !year) {
                  return alert("Please select a file and enter the year.");
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("year", year);
                setLoading(true);

                try {
                  const res = await axios.post(
                    "http://localhost:5000/api/predict-merit",
                    formData
                  );
                  alert(
                    `✅ Merit prediction completed successfully for ${year}.`
                  );
                } catch (err) {
                  if (err.response?.status === 409) {
                    alert(`⚠️ Prediction for year ${year} already exists.`);
                  } else {
                    alert("❌ Prediction failed. Please try again.");
                    console.error(err);
                  }
                } finally {
                  setLoading(false);
                  e.target.reset();
                }
              }}
            >
              <input type="file" name="file" accept=".csv,.xlsx" required />
              <input
                type="number"
                name="year"
                placeholder="Enter year to predict (e.g. 2026)"
                required
              />
              <button type="submit" className="auth-btn green-btn">
                Predict Merit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
