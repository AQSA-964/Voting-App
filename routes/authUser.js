const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const candidateController = require("../controllers/candidateController");

// Route for creating a new user
router.post("/login", userController.loginUser);

// Route for creating a new user
router.post("/signup", userController.signup);

router.get("/vote/count", candidateController.voteCount);

module.exports = router;
