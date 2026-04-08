const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getAll = async (req, res) => {
  try {
    const result = await db("users").select("*");
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_USERS",
        status_code: 200,
        user_id: null,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_USERS",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("users").select("*").where("id", id).first();
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_USER",
        status_code: 200,
        user_id: result.id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_USER",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getGroupsById = async (req, res) => {
  const { id } = req.params;
  try {
    const groupData = await db("groups")
      .select("*")
      .whereRaw("? = ANY(user_ids)", [id]);
    if (groupData) {
      createLog({
        method: "GET",
        action: "FETCH_USER_GROUPS",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(groupData),
      });
    }
    res.status(200).send(groupData);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_USER_GROUPS",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getGoalsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("user_goals")
      .select("*")
      .where("user_id", id)
      .first();

    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_USER_GOALS",
        status_code: 200,
        user_id: result.id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_USER_GOALS",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getWorkoutsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("user_workouts")
      .select("*")
      .where("user_id", id)
      .first();
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_USER_WORKOUTS",
        status_code: 200,
        user_id: result.id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_USER_WORKOUTS",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const result = await db("user_events").select("*");
    createLog({ method: "GET", action: "FETCH_ALL_USER_EVENTS", status_code: 200, user_id: null, metadata: JSON.stringify(result) });
    res.status(200).send(result);
  } catch (err) {
    createLog({ method: "GET", action: "FETCH_ALL_USER_EVENTS", status_code: 500, user_id: null, metadata: err });
    res.status(500).send({ message: err });
  }
};

const getEventsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("user_events")
      .select("*")
      .where("user_id", id);
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_USER_EVENTS",
        status_code: 200,
        user_id: result.id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_USER_EVENTS",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getScoresById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("scores").select("*").where("user_id", id).first();
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_USER_SCORES",
        status_code: 200,
        user_id: result.id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_USER_SCORES",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

module.exports = {
  getAll,
  getById,
  getGroupsById,
  getGoalsById,
  getWorkoutsById,
  getAllEvents,
  getEventsById,
  getScoresById,
};
