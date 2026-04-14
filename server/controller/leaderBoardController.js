const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getBestRun = async (req, res) => {
  try {
    const result = await db("user_workouts")
      .join("users", "user_workouts.user_id", "users.id")
      .where("user_workouts.name", "2-Mile Run")
      .select(
        "user_workouts.id as workout_id",
        "user_workouts.time",
        "users.username",
        "users.rank",
        "users.xp",
        "users.first_name",
        "users.last_name",
        "users.gender",
        "users.age",
        "users.profile"
      )
      .orderBy("user_workouts.time", "asc");

    if (result.length > 0) {
      createLog({
        method: "GET",
        action: "FETCH_BEST_RUNS",
        status_code: 200,
        user_id: null,
        metadata: JSON.stringify({ count: result.length }),
      });
    }

    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_BEST_RUNS_ERROR",
      status_code: 500,
      user_id: null,
      metadata: err.message,
    });
    res.status(500).send({ message: err.message });
  }
};

const getBestSitUps = async (req, res) => {
  try {
    const result = await db("user_workouts")
      .join("users", "user_workouts.user_id", "users.id")
      .where("name", "1-Minute Sit-ups")
      .select(
        "user_workouts.id as workout_id",
        "user_workouts.time",
        "user_workouts.reps",
        "users.username",
        "users.rank",
        "users.xp",
        "users.first_name",
        "users.last_name",
        "users.gender",
        "users.age",
        "users.profile"
      )
      .orderBy("user_workouts.reps", "desc");
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_BEST_SITUPS",
        status_code: 200,
        user_id: null,
        metadata: { message: "fetched best situps from all user" },
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "POST",
      action: "FETCH_BEST_SITUPS",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getBestPushUps = async (req, res) => {
  try {
    const result = await db("user_workouts")
      .join("users", "user_workouts.user_id", "users.id")
      .where("name", "1-Minute Push-ups")
      .select(
        "user_workouts.id as workout_id",
        "user_workouts.time",
        "user_workouts.reps",
        "users.username",
        "users.rank",
        "users.xp",
        "users.first_name",
        "users.last_name",
        "users.gender",
        "users.age",
        "users.profile"
      )
      .orderBy("user_workouts.reps", "desc");
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_BEST_PUSHUPS",
        status_code: 200,
        user_id: null,
        metadata: { message: "fetched best pushups from all user" },
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "POST",
      action: "FETCH_BEST_PUSHUPS",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

module.exports = { getBestRun, getBestSitUps, getBestPushUps };
