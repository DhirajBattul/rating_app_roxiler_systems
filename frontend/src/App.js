import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import AddUser from "./pages/AddUser";
import AddStore from "./pages/AddStore";
import UserDetails from "./pages/UserDetails";

import UserStores from "./pages/UserStores";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/change-password"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users/add"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AddUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <UserDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminStores />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/stores/add"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AddStore />
                </PrivateRoute>
              }
            />

            {/* Normal user routes */}
            <Route
              path="/stores"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <UserStores />
                </PrivateRoute>
              }
            />

            {/* Store owner routes */}
            <Route
              path="/store-owner/dashboard"
              element={
                <PrivateRoute allowedRoles={["store_owner"]}>
                  <StoreOwnerDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
