import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      const params = { ...filters, sortBy, order };
      const res = await api.get("/admin/stores", { params });
      setStores(res.data);
    } catch (err) {
      setError("Could not load stores");
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setOrder("ASC");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Stores</h2>
        <Link to="/admin/stores/add" className="btn-link">
          + Add Store
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form className="filter-bar" onSubmit={handleSearch}>
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} />
        <input
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleFilterChange}
        />
        <button type="submit">Search</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("email")}>Email</th>
            <th onClick={() => toggleSort("address")}>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.avgRating ? Number(s.avgRating).toFixed(1) : "No ratings yet"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStores;
