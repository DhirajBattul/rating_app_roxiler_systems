const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboardStats,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserDetails,
} = require("../controllers/adminController");

// All routes here require the user to be logged in AND be an admin
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.post("/users", createUser);
router.post("/stores", createStore);
router.get("/stores", listStores);
router.get("/users", listUsers);
router.get("/users/:id", getUserDetails);

module.exports = router;
