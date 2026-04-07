const express = require("express");
const {
  getAll,
  getById,
  getGoalsById,
  getWorkoutsById,
  getEventsById,
} = require("../controller/groupsController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);
router.get("/group_goals/id/:id", getGoalsById);
router.get("/group_workouts/id/:id", getWorkoutsById);
router.get("/group_events/id/:id", getEventsById);

module.exports = router;
