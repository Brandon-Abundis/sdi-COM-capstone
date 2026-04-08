const express = require("express");
const {
  getAll,
  getById,
  getGroupsById,
  getGoalsById,
  getWorkoutsById,
  getAllEvents,
  getEventsById,
  createEvent,
  updateById,
  updateRivalById,
  removeRivalById,
} = require("../controller/userController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);
router.post("/id/:id", updateById);
router.post("/rival/id/:id", updateRivalById);
router.post("/rival/remove/id/:id", removeRivalById);
router.get("/groups/id/:id", getGroupsById);
router.get("/user_goals/id/:id", getGoalsById);
router.get("/user_workouts/id/:id", getWorkoutsById);
router.get("/user_events/", getAllEvents);
router.get("/user_events/id/:id", getEventsById);
router.post("/user_events", createEvent);

module.exports = router;
