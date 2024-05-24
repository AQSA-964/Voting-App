const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 18;
      },
      message: (props) =>
        `Age must be at least 18. Provided age is ${props.value}`,
    },
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        // return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
        return /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  mobile: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{11}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile Number!`,
    },
  },
  address: {
    type: String,
    required: true,
  },
  CNIC: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{5}-\d{7}-\d{1}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid CNIC number!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  try {
    if (!this.isModified("password")) {
      return next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // Replace the plain text password with the hashed one
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (voterPassword) {
  try {
    return await bcrypt.compare(voterPassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords: " + error.message);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
