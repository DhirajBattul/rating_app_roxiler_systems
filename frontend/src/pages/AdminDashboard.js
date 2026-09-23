import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        setError("Could not load dashboard stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>
      {error && <p className="error-text">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalStores}</h3>
          <p>Total Stores</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalRatings}</h3>
          <p>Total Ratings</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
