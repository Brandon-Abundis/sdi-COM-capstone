const express = require("express");

const {
  getAllScores,
  getScoresById,
} = require("../controller/scoreController");

const router = express();

router.get("/", getAllScores);
router.get("/id/:id", getScoresById);

module.exports = router;
