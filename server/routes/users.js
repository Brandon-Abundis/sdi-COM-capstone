const express = require("express");
const {
  getAll,
  getById,
  createUser,
  getGroupsById,
  getGoalsById,
  updateGoalsById,
  createGoal,
  getWorkoutsById,
  updateWorkoutById,
  createWorkout,
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
router.post("/create", createUser);
router.post("/rival/id/:id", updateRivalById);
router.post("/rival/remove/id/:id", removeRivalById);
router.get("/groups/id/:id", getGroupsById);
router.get("/user_goals/id/:id", getGoalsById);
router.post("/user_goals/update/id/:id", updateGoalsById);
router.post("/user_goals/create/", createGoal);
router.get("/user_workouts/id/:id", getWorkoutsById);
router.post("/user_workouts/update/id/:id", updateWorkoutById);
router.post("/user_workouts/create/", createWorkout);
router.get("/user_events/", getAllEvents);
router.get("/user_events/id/:id", getEventsById);
router.post("/user_events", createEvent);

module.exports = router;
