const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getMyStoreDashboard } = require("../controllers/storeOwnerController");

router.use(protect, authorize("store_owner"));

router.get("/dashboard", getMyStoreDashboard);

module.exports = router;
