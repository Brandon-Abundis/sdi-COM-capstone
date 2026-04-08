const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getAll = async (req, res) => {
  try {
    const result = await db("groups").select("*");
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_GROUPS",
        status_code: 200,
        user_id: null,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_GROUPS",
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
    const result = await db("groups").select("*").where("id", id).first();
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_GROUP",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_GROUPS",
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
    const result = await db("group_goals")
      .select("*")
      .where("group_id", id)
      .first();
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_GROUP_GOALS",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_GROUPS_GOALS",
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
    const result = await db("group_workouts")
      .select("*")
      .where("group_id", id)
      .first();
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_GROUP_WORKOUTS",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_GROUP_WORKOUTS",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const createGroup = async (req, res) => {
  const { name, user_id } = req.body;
  if (!name?.trim()) return res.status(400).send({ message: "Name is required" });
  try {
    const adminIds = user_id ? [user_id] : [];
    const userIds = user_id ? [user_id] : [];
    const [result] = await db("groups")
      .insert({ name: name.trim(), admin_ids: adminIds, user_ids: userIds })
      .returning("*");
    createLog({ method: "POST", action: "CREATE_GROUP", status_code: 201, user_id, metadata: JSON.stringify(result) });
    res.status(201).send(result);
  } catch (err) {
    createLog({ method: "POST", action: "CREATE_GROUP", status_code: 500, user_id, metadata: err });
    res.status(500).send({ message: err });
  }
};

const joinGroup = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).send({ message: "user_id is required" });
  try {
    await db.raw("UPDATE groups SET user_ids = array_append(user_ids, ?) WHERE id = ? AND NOT (? = ANY(user_ids))", [user_id, id, user_id]);
    const result = await db("groups").select("*").where("id", id).first();
    createLog({ method: "PATCH", action: "JOIN_GROUP", status_code: 200, user_id, metadata: JSON.stringify(result) });
    res.status(200).send(result);
  } catch (err) {
    createLog({ method: "PATCH", action: "JOIN_GROUP", status_code: 500, user_id, metadata: err });
    res.status(500).send({ message: err });
  }
};

const leaveGroup = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).send({ message: "user_id is required" });
  try {
    await db.raw("UPDATE groups SET user_ids = array_remove(user_ids, ?), admin_ids = array_remove(admin_ids, ?) WHERE id = ?", [user_id, user_id, id]);
    createLog({ method: "PATCH", action: "LEAVE_GROUP", status_code: 200, user_id, metadata: `User ${user_id} left group ${id}` });
    res.status(200).send({ message: "Left group" });
  } catch (err) {
    createLog({ method: "PATCH", action: "LEAVE_GROUP", status_code: 500, user_id, metadata: err });
    res.status(500).send({ message: err });
  }
};

const inviteToGroup = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).send({ message: "user_id is required" });
  try {
    await db.raw("UPDATE groups SET user_ids = array_append(user_ids, ?) WHERE id = ? AND NOT (? = ANY(user_ids))", [user_id, id, user_id]);
    const result = await db("groups").select("*").where("id", id).first();
    createLog({ method: "PATCH", action: "INVITE_TO_GROUP", status_code: 200, user_id, metadata: JSON.stringify(result) });
    res.status(200).send(result);
  } catch (err) {
    createLog({ method: "PATCH", action: "INVITE_TO_GROUP", status_code: 500, user_id, metadata: err });
    res.status(500).send({ message: err });
  }
};

const getEventsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("group_events")
      .select("*")
      .where("group_id", id);
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_GROUP_EVENTS",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_GROUP_EVENTS",
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
  getGoalsById,
  getWorkoutsById,
  getEventsById,
  createGroup,
  joinGroup,
  leaveGroup,
  inviteToGroup,
};
