const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Retrieve all users
router.get("/profile", userController.profile);

// Route for retrieving user details by ID
router.put("/profile/password", userController.changePassword);

module.exports = router;
