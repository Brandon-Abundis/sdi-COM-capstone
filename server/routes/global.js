const express = require("express");
const { getAll } = require("../controller/globalController");
const router = express();

router.post("/", getAll);

module.exports = router;
