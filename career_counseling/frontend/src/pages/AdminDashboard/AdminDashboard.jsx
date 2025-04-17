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
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
    fetchContacts();
  }, []);

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
      alert("\u26A0\uFE0F Cannot delete the last remaining admin.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this admin account?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/admin/${id}`);
        alert("\u2705 Admin deleted successfully.");
        fetchAdmins();
      } catch (error) {
        const isJSON = error.response && error.response.data && error.response.data.message;
        const message = isJSON ? error.response.data.message : `Non-JSON error (code ${error.response?.status || 500})`;
        console.error("Admin Delete Error:", error);
        alert(`\u274C Failed to delete admin: ${message}`);
      }
    }
  };

  const handleReplyChange = (id, value) => {
    setReply((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = async (email, id) => {
    const message = reply[id];
    if (!message) return alert("Please type a reply.");

    try {
      const res = await axios.post("http://localhost:5000/api/contact/reply", {
        email,
        message,
        contactId: id,
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
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;

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
      <img
        src={logoutIcon}
        alt="Logout"
        title="Logout"
        onClick={handleLogout}
        style={{ position: "absolute", top: "15px", right: "20px", width: "30px", height: "30px", cursor: "pointer" }}
      />

      <div className="top-bar">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div>
          <button className="auth-btn signup-btn" onClick={() => navigate("/admin/signup")}>
            Admin Signup
          </button>
          <button
            className="auth-btn"
            onClick={() => navigate("/home")}
            style={{ marginLeft: "10px", backgroundColor: "#008080", color: "white" }}
          >
            Login as User
          </button>
        </div>
      </div>

      {/* USERS */}
      <h2 className="section-heading">📋 Registered Users</h2>
      {users.length === 0 ? (
        <p className="no-users">No users found.</p>
      ) : (
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
                  <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ADMINS */}
      <h2 className="section-heading">🗡️ Admin Accounts</h2>
      {admins.length === 0 ? (
        <p className="no-users">No admins found.</p>
      ) : (
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
                  <button className="delete-btn" onClick={() => handleDeleteAdmin(admin._id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CONTACTS */}
      <h2 className="section-heading">📨 Contact Messages</h2>
      {contacts.length === 0 ? (
        <p className="no-users">No messages found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Reply</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact._id}>
                <td>{index + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td>{contact.replied ? "✅ Replied" : "⏳ Pending"}</td>
                <td>
                  {contact.replied ? (
                    <div style={{ color: "#555", whiteSpace: "pre-line" }}>
                      {contact.replyMessage}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMessage(contact._id)}
                        title="Delete Message"
                        style={{ marginLeft: "10px", fontSize: "16px" }}
                      >
                        🗑️
                      </button>
                    </div>
                  ) : (
                    <>
                      <textarea
                        rows="2"
                        cols="30"
                        value={reply[contact._id] || ""}
                        onChange={(e) => handleReplyChange(contact._id, e.target.value)}
                        placeholder="Type reply here"
                      ></textarea>
                      <br />
                      <button
                        className="auth-btn user-btn"
                        onClick={() => handleSendReply(contact.email, contact._id)}
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
      )}
    </div>
  );
};

export default AdminDashboard;
