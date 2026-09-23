import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AddStore = () => {
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
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
      await api.post("/admin/stores", form);
      setMessage("Store created successfully");
      setTimeout(() => navigate("/admin/stores"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create store");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Store</h2>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Store Name (20-60 characters)</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Store Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address (max 400 characters)</label>
        <textarea name="address" value={form.address} onChange={handleChange} />

        <label>Owner User ID (optional, must be a Store Owner account)</label>
        <input name="ownerId" value={form.ownerId} onChange={handleChange} />

        <button type="submit">Create Store</button>
      </form>
    </div>
  );
};

export default AddStore;
