import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        setError("Could not load user details");
      }
    };
    fetchUser();
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>User Details</h2>
      <div className="detail-card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        {user.role === "store_owner" && (
          <p>
            <strong>Store Rating:</strong>{" "}
            {user.storeRating ? Number(user.storeRating).toFixed(1) : "No ratings yet"}
          </p>
        )}
      </div>
      <Link to="/admin/users">Back to Users</Link>
    </div>
  );
};

export default UserDetails;
