const express = require("express");

const { getAllScores } = require("../controller/scoreController")

const router = express();

router.get("/", getAllScores);

module.exports = router;