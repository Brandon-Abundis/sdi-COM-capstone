const express = require("express");
const { getAll } = require("../controller/logController");
const router = express();

router.get("/", getAll);

module.exports = router;
