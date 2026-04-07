const express = require("express");
const { getAll, getById } = require("../controller/groupsController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);

module.exports = router;
