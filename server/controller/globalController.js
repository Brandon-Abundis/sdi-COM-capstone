const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getAll = async (req, res) => {
  try {
    const result = await db("global_events").select("*");
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const updateGlobalEventById = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    completed,
    workout_list,
    goal_list,
    participant_ids,
  } = req.body;
  try {
    if (
      !title &&
      !description &&
      !start_date &&
      !end_date &&
      !start_time &&
      !end_time &&
      !completed &&
      !workout_list &&
      !goal_list &&
      !participant_ids
    ) {
      createLog({
        method: "POST",
        action: "UPDATE_GLOBAL_EVENT",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const globalEventData = await db("global_events")
      .select("*")
      .where("id", id);
    if (!globalEventData) {
      createLog({
        method: "POST",
        action: "UPDATE_GLOBAL_EVENT",
        status_code: 400,
        user_id: id,
        metadata: { message: "event does not exist" },
      });
      return res.status(400).json({ message: "event does not exist" });
    }
    const result = await db("global_events")
      .select("*")
      .where("id", id)
      .update({
        title: title ? title : globalEventData.title,
        description: description ? description : globalEventData.description,
        start_date: start_date ? start_date : globalEventData.start_date,
        end_date: end_date ? end_date : globalEventData.end_date,
        start_time: start_time ? start_time : globalEventData.start_time,
        end_time: end_time ? end_time : globalEventData.end_time,
        completed: completed ? completed : globalEventData.completed,
        workout_list: workout_list
          ? workout_list
          : globalEventData.workout_list,
        goal_list: goal_list ? goal_list : globalEventData.goal_list,
        participant_ids: participant_ids
          ? participant_ids
          : globalEventData.participant_ids,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_GLOBAL_EVENT",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "UPDATE_GLOBAL_EVENT",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const createGlobalEvent = async (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    completed,
    workout_list,
    goal_list,
    participant_ids,
    user_id,
  } = req.body;
  try {
    if (
      (!title &&
        !description &&
        !start_date &&
        !end_date &&
        !start_time &&
        !end_time &&
        !completed &&
        !workout_list &&
        !goal_list &&
        !participant_ids) ||
      !user_id
    ) {
      createLog({
        method: "POST",
        action: "CREATE_GLOBAL_EVENT",
        status_code: 400,
        user_id: user_id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("global_events")
      .insert({
        title: title,
        description: description,
        start_date: start_date,
        end_date: end_date,
        start_time: start_time,
        end_time: end_time,
        completed: completed,
        workouts_list: workout_list,
        goals_list: goal_list,
        participant_ids: participant_ids,
        user_id: user_id,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "CREATE_GLOBAL_EVENT",
        status_code: 200,
        user_id: user_id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "GET",
      action: "CREATE_GLOBAL_EVENT",
      status_code: 500,
      user_id: user_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

module.exports = { getAll, createGlobalEvent, updateGlobalEventById };
