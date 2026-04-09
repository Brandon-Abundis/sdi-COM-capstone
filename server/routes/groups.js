const express = require("express");
const {
  getAll,
  getById,
  getGoalsById,
  updateGoalsById,
  createGoal,
  getWorkoutsById,
  getEventsById,
  createGroup,
  joinGroup,
  leaveGroup,
  inviteToGroup,
  updateWorkoutById,
  createWorkout,
} = require("../controller/groupsController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);
router.get("/group_goals/id/:id", getGoalsById);
router.post("/group_goals/update/id/:id", updateGoalsById);
router.post("/group_goals/create", createGoal);
router.get("/group_workouts/id/:id", getWorkoutsById);
router.post("/group_workouts/update/id/:id", updateWorkoutById);
router.post("/group_workouts/create", createWorkout);
router.get("/group_events/id/:id", getEventsById);
router.post("/", createGroup);
router.patch("/:id/join", joinGroup);
router.patch("/:id/leave", leaveGroup);
router.patch("/:id/invite", inviteToGroup);

module.exports = router;
