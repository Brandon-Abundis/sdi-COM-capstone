const express = require("express");
const {
  getAll,
  createGlobalEvent,
  updateGlobalEventById,
} = require("../controller/globalController");
const router = express();

router.get("/", getAll);
router.post("/create", createGlobalEvent);
router.post("/update/id/:id", updateGlobalEventById);

module.exports = router;
