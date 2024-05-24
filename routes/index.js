const authUser = require("../routes/authUser");
const userRoutes = require("../routes/userRoutes");
const candidateRoutes = require("../routes/candidateRoutes");
const express = require("express");
const app = express();
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");

router.use("/", authUser);
router.use("/users", jwtAuthMiddleware, userRoutes);
router.use("/candidates", jwtAuthMiddleware, candidateRoutes);

module.exports = router;
