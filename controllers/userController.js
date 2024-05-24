const { User } = require("../models/userModel");
const { generateToken } = require("../jwt");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res) => {
  try {
    const { CNIC, password } = req.body;

    const user = await User.findOne({ CNIC });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid CNIC or password" });
    }

    const payload = { id: user.id };
    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, age, email, mobile, address, CNIC, password, role, isVoted } =
      req.body;

    // Check if there is already an admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (req.body.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Check if a user with the same CNIC Number already exists
    const existingUser = await User.findOne({ CNIC });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same CNIC already exists" });
    }

    const newUser = await User.create({
      name,
      age,
      email,
      mobile,
      address,
      CNIC,
      password,
      role,
      isVoted,
    });

    const payload = {
      id: newUser.id,
    };

    const token = generateToken(payload);

    res.status(200).json({
      message: "User Registered successfully",
      savedUser: newUser,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Controller function to get user profile
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Controller function to update user password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // check if currentPassword and newPassword are present in the request body
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }

    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
