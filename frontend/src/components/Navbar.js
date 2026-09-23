import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Store Rating App</div>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}

        {user && user.role === "user" && (
          <>
            <Link to="/stores">Stores</Link>
            <Link to="/change-password">Change Password</Link>
          </>
        )}

        {user && user.role === "store_owner" && (
          <>
            <Link to="/store-owner/dashboard">My Store</Link>
            <Link to="/change-password">Change Password</Link>
          </>
        )}

        {user && (
          <button className="link-button" onClick={handleLogout}>
            Logout ({user.name.split(" ")[0]})
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
