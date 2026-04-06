const express = require("express");
const { getAll, getById } = require("../controller/userController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);

module.exports = router;
