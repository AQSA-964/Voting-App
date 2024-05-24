const { User } = require("../models/userModel");
const Candidate = require("../models/candidateModel");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true;
    }
  } catch (error) {
    return false;
  }
};

// Controller function to add candidate
exports.addCandidate = async (req, res) => {
  try {
    // const userId = req.user.id;

    // const user = await User.findById(userId);
    // if (!user || user.role !== "admin") {
    //   return res.status(403).json({ message: "User does not have admin role" });
    // }

    if (!(await checkAdminRole(req.user.id))) {
      return res.status(404).json({ message: "user does not have admin role" });
    }
    const { name, party, age } = req.body;

    if (req.body.voteCount) {
      return res.status(404).json({ message: "admin can't add vote" });
    }
    const existingParty = await Candidate.findOne({ party });
    if (existingParty) {
      return res
        .status(400)
        .json({ error: "Candidate with the same party already exists" });
    }

    const newCandidate = await Candidate.create({ name, party, age });

    res.status(200).json(newCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(404).json({ message: "user does not have admin role" });
    }

    const candidateId = req.params.candidateId;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true, //return the updated document
        runValidators: true, // Run Mongoose validation
      }
    );
    if (!response) {
      return res.status(401).json({ error: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate data updated", response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(404).json({ message: "user does not have admin role" });
    }

    const candidateId = req.params.candidateId;

    const response = await Candidate.findByIdAndDelete(candidateId);

    if (!response) {
      return res.status(401).json({ error: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate data deleted", response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//let's start voting  /vote/:candidateId
exports.vote = async (req, res) => {
  const candidateId = req.params.candidateId;
  const userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVoted) {
      return res.status(404).json({ message: "You have already voted" });
    }

    if (user.role === "admin") {
      return res.status(404).json({ message: "admin is not allowed" });
    }

    // Update the candidate doc to record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();
    // isVoted = true;
    // await User.updateOne();

    // Update the user document to mark as voted
    await User.updateOne({ _id: userId }, { $set: { isVoted: true } });

    res.status(200).json({ message: "Vote cast successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: err.message });
  }
};

//vote count  /vote/count
exports.voteCount = async (req, res) => {
  try {
    // finding all candidates and sort them by coteCount in descending order
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    // map the candidate to on;y return their name and voteCount
    const VoteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    res.status(200).json({ VoteRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: err.message });
  }
};

// Get List of all candidates with only name and party fields
exports.getAllCandidates = async (req, res) => {
  try {
    // Find all candidates and select only the name and party fields, excluding _id
    const candidates = await Candidate.find({}, "name party -_id");

    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: err.message });
  }
};
