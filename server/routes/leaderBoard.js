const express = require("express");

const { getBestRun, getBestSitUps, getBestPushUps } = require('../controller/leaderBoardController');

const router = express();

router.get('/runs', getBestRun);
router.get('/situps', getBestSitUps);
router.get('/pushups', getBestPushUps);


module.exports = router;