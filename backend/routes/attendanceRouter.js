const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// API Check-In
router.post("/check-in", attendanceController.checkInHandler);

// API Check-Out
router.post("/check-out", attendanceController.checkOutHandler);


module.exports = router;