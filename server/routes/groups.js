const express = require("express");
const {
  getAll,
  getById,
  getGoalsById,
  getWorkoutsById,
  getEventsById,
  createGroup,
  joinGroup,
  leaveGroup,
  inviteToGroup,
} = require("../controller/groupsController");
const router = express();

router.get("/", getAll);
router.get("/id/:id", getById);
router.get("/group_goals/id/:id", getGoalsById);
router.get("/group_workouts/id/:id", getWorkoutsById);
router.get("/group_events/id/:id", getEventsById);
router.post("/", createGroup);
router.patch("/:id/join", joinGroup);
router.patch("/:id/leave", leaveGroup);
router.patch("/:id/invite", inviteToGroup);

module.exports = router;
