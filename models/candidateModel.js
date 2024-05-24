const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      votedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

candidateSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if ("voteCount" in update) {
    const err = new Error("Admin cannot edit voteCount");
    next(err);
  } else {
    next();
  }
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
