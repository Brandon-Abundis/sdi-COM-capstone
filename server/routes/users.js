const express = require("express");
const {
  getAll,
  getById,
  getGroupsById,
  getGoalsById,
  getWorkoutsById,
  getAllEvents,
  getEventsById,
  getScoresById,
} = require("../controller/userController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);
router.get("/groups/id/:id", getGroupsById);
router.get("/user_goals/id/:id", getGoalsById);
router.get("/user_workouts/id/:id", getWorkoutsById);
router.get("/user_events/", getAllEvents);
router.get("/user_events/id/:id", getEventsById);
router.get("/scores/id/:id", getScoresById);

module.exports = router;
