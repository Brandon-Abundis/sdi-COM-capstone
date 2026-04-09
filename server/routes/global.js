const express = require("express");
const { getAll } = require("../controller/globalController");
const router = express();

router.get("/", getAll);

module.exports = router;
