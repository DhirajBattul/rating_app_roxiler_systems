import React, { useEffect, useState } from "react";
import api from "../api/axios";

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/store-owner/dashboard");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your store dashboard");
      }
    };
    fetchData();
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>{data.store.name}</h2>
      <p>{data.store.address}</p>
      <h3>Average Rating: {data.averageRating || "No ratings yet"}</h3>

      <h3>Users who rated your store</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.raters.map((r) => (
            <tr key={r.userId}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreOwnerDashboard;
