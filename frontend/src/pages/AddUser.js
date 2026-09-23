import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/admin/users", form);
      setMessage("User created successfully");
      setTimeout(() => navigate("/admin/users"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create user");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New User</h2>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name (20-60 characters)</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address (max 400 characters)</label>
        <textarea name="address" value={form.address} onChange={handleChange} />

        <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Normal User</option>
          <option value="admin">System Administrator</option>
          <option value="store_owner">Store Owner</option>
        </select>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default AddUser;
