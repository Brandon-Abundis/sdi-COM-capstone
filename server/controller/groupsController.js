const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getAll = async (req, res) => {
  try {
    const result = await db("groups").select("*");
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

const updateById = async (req, res) => {
  const { id } = req.params;
  const { name, admin_ids, user_ids } = req.body;
  try {
    if (!name && !admin_ids && !user_ids) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP_GOAL",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const groupData = await db("groups").select("*").where("id", id);
    if (!groupData) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP",
        status_code: 400,
        user_id: id,
        metadata: { message: "group does not exist" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("groups")
      .select("*")
      .where("id", id)
      .update({
        name: name ? name : groupData.name,
        admin_ids: admin_ids ? admin_ids : groupData.admin_ids,
        user_ids: user_ids ? user_ids : groupData.user_ids,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "UPDATE_GROUP",
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

const updateGoalsById = async (req, res) => {
  const { id } = req.params;
  const { name, type, time, distance, reps, muscle_group, weight, notes } =
    req.body;
  try {
    if (
      !name &&
      !type &&
      !time &&
      !distance &&
      !reps &&
      !muscle_group &&
      !weight &&
      !notes
    ) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP_GOAL",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const groupGoalData = await db("group_goals").select("*").where("id", id);
    if (!groupGoalData) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP_GOAL",
        status_code: 400,
        user_id: id,
        metadata: { message: "goal does not exist" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("group_goals")
      .select("*")
      .where("id", id)
      .update({
        name: name ? name : groupGoalData.name,
        type: type ? type : groupGoalData.type,
        time: time ? time : groupGoalData.time,
        distance: distance ? distance : groupGoalData.distance,
        reps: reps ? reps : groupGoalData.reps,
        muscle_group: muscle_group ? muscle_group : groupGoalData.muscle_group,
        weight: weight ? weight : groupGoalData.weight,
        notes: notes ? notes : groupGoalData.notes,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP_GOAL",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "UPDATE_GROUP_GOAL",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const createGoal = async (req, res) => {
  const {
    name,
    type,
    time,
    distance,
    reps,
    muscle_group,
    weight,
    notes,
    group_id,
  } = req.body;
  try {
    if (
      (!name &&
        !type &&
        !time &&
        !distance &&
        !reps &&
        !muscle_group &&
        !weight &&
        !notes) ||
      !group_id
    ) {
      createLog({
        method: "POST",
        action: "CREATE_GROUP_GOAL",
        status_code: 400,
        user_id: group_id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("group_goals")
      .insert({
        name: name,
        type: type,
        time: time,
        distance: distance,
        reps: reps,
        muscle_group: muscle_group,
        weight: weight,
        notes: notes,
        group_id: group_id,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "CREATE_GROUP_GOAL",
        status_code: 200,
        group_id: group_id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "CREATE_GROUP_GOAL",
      status_code: 500,
      user_id: group_id,
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

const updateWorkoutById = async (req, res) => {
  const { id } = req.params;
  const { name, type, time, distance, reps, muscle_group, weight, notes } =
    req.body;
  try {
    if (
      !name &&
      !type &&
      !time &&
      !distance &&
      !reps &&
      !muscle_group &&
      !weight &&
      !notes
    ) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP_WORKOUT",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const groupWorkoutData = await db("group_workouts")
      .select("*")
      .where("id", id);
    if (!groupWorkoutData) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP_WORKOUT",
        status_code: 400,
        user_id: id,
        metadata: { message: "workout does not exist" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("group_workouts")
      .select("*")
      .where("id", id)
      .update({
        name: name ? name : groupWorkoutData.name,
        type: type ? type : groupWorkoutData.type,
        time: time ? time : groupWorkoutData.time,
        distance: distance ? distance : groupWorkoutData.distance,
        reps: reps ? reps : groupWorkoutData.reps,
        muscle_group: muscle_group
          ? muscle_group
          : groupWorkoutData.muscle_group,
        weight: weight ? weight : groupWorkoutData.weight,
        notes: notes ? notes : groupWorkoutData.notes,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_GROUP_WORKOUT",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "UPDATE_GROUP_WORKOUT",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const createWorkout = async (req, res) => {
  const {
    name,
    type,
    time,
    distance,
    reps,
    muscle_group,
    weight,
    notes,
    group_id,
  } = req.body;
  try {
    if (
      (!name &&
        !type &&
        !time &&
        !distance &&
        !reps &&
        !muscle_group &&
        !weight &&
        !notes) ||
      !group_id
    ) {
      createLog({
        method: "POST",
        action: "CREATE_GROUP_WORKOUT",
        status_code: 400,
        user_id: group_id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("group_workouts")
      .insert({
        name: name,
        type: type,
        time: time,
        distance: distance,
        reps: reps,
        muscle_group: muscle_group,
        weight: weight,
        notes: notes,
        group_id: group_id,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "CREATE_GROUP_WORKOUT",
        status_code: 200,
        user_id: group_id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "CREATE_GROUP_WORKOUT",
      status_code: 500,
      user_id: group_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const createGroup = async (req, res) => {
  const { name, user_id } = req.body;
  if (!name?.trim())
    return res.status(400).send({ message: "Name is required" });
  try {
    const adminIds = user_id ? [user_id] : [];
    const userIds = user_id ? [user_id] : [];
    const [result] = await db("groups")
      .insert({ name: name.trim(), admin_ids: adminIds, user_ids: userIds })
      .returning("*");
    createLog({
      method: "POST",
      action: "CREATE_GROUP",
      status_code: 201,
      user_id,
      metadata: JSON.stringify(result),
    });
    res.status(201).send(result);
  } catch (err) {
    createLog({
      method: "POST",
      action: "CREATE_GROUP",
      status_code: 500,
      user_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const joinGroup = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).send({ message: "user_id is required" });
  try {
    await db.raw(
      "UPDATE groups SET user_ids = array_append(user_ids, ?) WHERE id = ? AND NOT (? = ANY(user_ids))",
      [user_id, id, user_id],
    );
    const result = await db("groups").select("*").where("id", id).first();
    createLog({
      method: "PATCH",
      action: "JOIN_GROUP",
      status_code: 200,
      user_id,
      metadata: JSON.stringify(result),
    });
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "PATCH",
      action: "JOIN_GROUP",
      status_code: 500,
      user_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const leaveGroup = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).send({ message: "user_id is required" });
  try {
    await db.raw(
      "UPDATE groups SET user_ids = array_remove(user_ids, ?), admin_ids = array_remove(admin_ids, ?) WHERE id = ?",
      [user_id, user_id, id],
    );
    createLog({
      method: "PATCH",
      action: "LEAVE_GROUP",
      status_code: 200,
      user_id,
      metadata: `User ${user_id} left group ${id}`,
    });
    res.status(200).send({ message: "Left group" });
  } catch (err) {
    createLog({
      method: "PATCH",
      action: "LEAVE_GROUP",
      status_code: 500,
      user_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const inviteToGroup = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).send({ message: "user_id is required" });
  try {
    await db.raw(
      "UPDATE groups SET user_ids = array_append(user_ids, ?) WHERE id = ? AND NOT (? = ANY(user_ids))",
      [user_id, id, user_id],
    );
    const result = await db("groups").select("*").where("id", id).first();
    createLog({
      method: "PATCH",
      action: "INVITE_TO_GROUP",
      status_code: 200,
      user_id,
      metadata: JSON.stringify(result),
    });
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "PATCH",
      action: "INVITE_TO_GROUP",
      status_code: 500,
      user_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getEventsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("group_events").select("*").where("group_id", id);
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
  updateById,
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
};
