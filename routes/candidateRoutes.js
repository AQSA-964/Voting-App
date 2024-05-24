const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

// create new candidate (only admin)
router.post("/", candidateController.addCandidate);

// get all candidates
router.get("/", candidateController.getAllCandidates);

// update existing candidate (only admin)
router.put("/:candidateId", candidateController.updateCandidate);

// delete any candidate (only admin)
router.delete("/:candidateId", candidateController.deleteCandidate);

// vote for a candidate (only User)
router.post("/vote/:candidateId", candidateController.vote);

module.exports = router;
