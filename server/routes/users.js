const express = require("express");
const {
  getAll,
  getById,
  getGroupsById,
} = require("../controller/userController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);
router.get("/groups/id/:id", getGroupsById);

module.exports = router;
