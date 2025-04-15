const express = require("express");
const router = express.Router();
const {createUserForEmployeeHandler, getUserProfile} = require("../controllers/userController");
const {authMiddleware, authorizeRoles} = require('../middleware/authMiddleware');

router.post("/create-for-employee", authMiddleware, authorizeRoles("admin"), createUserForEmployeeHandler);

router.get('/me', authMiddleware, getUserProfile); 

module.exports = router;

