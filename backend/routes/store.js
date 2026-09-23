const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  listStoresForUser,
  submitRating,
  updateRating,
} = require("../controllers/storeController");

// These routes are for normal users
router.use(protect, authorize("user"));

router.get("/", listStoresForUser);
router.post("/rate", submitRating);
router.put("/rate", updateRating);

module.exports = router;
