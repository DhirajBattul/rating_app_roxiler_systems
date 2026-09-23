import React, { useEffect, useState } from "react";
import api from "../api/axios";
import StarRating from "../components/StarRating";

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchStores = async () => {
    try {
      const params = { ...filters, sortBy, order };
      const res = await api.get("/stores", { params });
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

  const handleRate = async (storeId, ratingValue, alreadyRated) => {
    setError("");
    setMessage("");
    try {
      if (alreadyRated) {
        await api.put("/stores/rate", { storeId, rating: ratingValue });
      } else {
        await api.post("/stores/rate", { storeId, rating: ratingValue });
      }
      setMessage("Rating saved");
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save rating");
    }
  };

  return (
    <div className="page-container">
      <h2>Stores</h2>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <form className="filter-bar" onSubmit={handleSearch}>
        <input name="name" placeholder="Search by name" value={filters.name} onChange={handleFilterChange} />
        <input
          name="address"
          placeholder="Search by address"
          value={filters.address}
          onChange={handleFilterChange}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => toggleSort("name")}>
          Sort by Name
        </button>
      </form>

      <div className="store-grid">
        {stores.map((store) => (
          <div className="store-card" key={store.id}>
            <h3>{store.name}</h3>
            <p>{store.address}</p>
            <p>
              Overall Rating:{" "}
              {store.avgRating ? Number(store.avgRating).toFixed(1) : "No ratings yet"}
            </p>
            <p>Your Rating:</p>
            <StarRating
              value={store.userRating || 0}
              onChange={(val) => handleRate(store.id, val, !!store.userRating)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStores;
