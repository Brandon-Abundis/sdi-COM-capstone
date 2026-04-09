const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getAll = async (req, res) => {
  try {
    const result = await db("users").select("*");
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

const updateById = async (req, res) => {
  const { id } = req.params;
  const {
    is_admin,
    first_name,
    username,
    last_name,
    email,
    rank,
    age,
    xp,
    is_active,
  } = req.body;
  try {
    if (
      !is_admin &&
      !first_name &&
      !last_name &&
      !username &&
      !email &&
      !rank &&
      !age &&
      !xp &&
      !is_active
    ) {
      createLog({
        method: "POST",
        action: "UPDATE_USER",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const userData = await db("users").select("*").where("id", id);
    const result = await db("users")
      .select("*")
      .where("id", id)
      .update({
        is_admin: is_admin ? is_admin : userData.is_admin,
        first_name: first_name ? first_name : userData.first_name,
        last_name: last_name ? last_name : userData.last_name,
        username: username ? username : userData.username,
        email: email ? email : userData.email,
        rank: rank ? rank : userData.rank,
        age: age ? age : userData.age,
        xp: xp ? xp : userData.xp,
        is_active: is_active ? is_active : userData.is_active,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_USER",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "GET",
      action: "UPDATE_USER",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const createUser = async (req, res) => {
  const { is_admin, first_name, username, last_name, email, rank, age, xp } =
    req.body;
  try {
    if (
      !is_admin &&
      !first_name &&
      !last_name &&
      !username &&
      !email &&
      !rank &&
      !age &&
      !xp
    ) {
      createLog({
        method: "POST",
        action: "CREATE_USER",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("users")
      .insert({
        is_admin: is_admin ? is_admin : userData.is_admin,
        first_name: first_name ? first_name : userData.first_name,
        last_name: last_name ? last_name : userData.last_name,
        username: username ? username : userData.username,
        email: email ? email : userData.email,
        rank: rank ? rank : userData.rank,
        age: age ? age : userData.age,
        xp: xp ? xp : userData.xp,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "CREATE_USER",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "CREATE_USER",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const updateRivalById = async (req, res) => {
  const { id } = req.params;
  const { rival_id } = req.body;
  try {
    if (!rival_id) {
      createLog({
        method: "POST",
        action: "UPDATE_USER_RIVAL",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const userData = await db("users").select("rival_ids").where("id", id);

    if (userData[0].rival_ids.includes(rival_id)) {
      createLog({
        method: "GET",
        action: "UPDATE_USER_RIVALS",
        status_code: 500,
        user_id: id,
        metadata: { message: "rival already exist" },
      });
      res.status(400).json({ message: "rival already exist" });
    }

    const newRivals = [...userData[0].rival_ids, rival_id];
    const result = await db("users")
      .select("rival_ids")
      .where("id", id)
      .update({ rival_ids: newRivals })
      .returning("*");

    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_USER_RIVALS",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "UPDATE_USER_RIVALS",
      status_code: 500,
      user_id: id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const removeRivalById = async (req, res) => {
  const { id } = req.params;
  const { rival_id } = req.body;
  try {
    if (!rival_id) {
      createLog({
        method: "POST",
        action: "REVEMO_USER_RIVAL",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const userData = await db("users").select("rival_ids").where("id", id);
    const newRivals = userData[0].rival_ids.filter(
      (currId) => currId !== rival_id,
    );
    console.log(await newRivals);
    const result = await db("users")
      .select("rival_ids")
      .where("id", id)
      .update({ rival_ids: newRivals })
      .returning("*");

    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_USER_RIVALS",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "UPDATE_USER_RIVALS",
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
        action: "UPDATE_USER_GOAL",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const userGoalData = await db("user_goals").select("*").where("id", id);
    if (!userGoalData) {
      createLog({
        method: "POST",
        action: "UPDATE_USER_GOAL",
        status_code: 400,
        user_id: id,
        metadata: { message: "goal does not exist" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("user_goals")
      .select("*")
      .where("id", id)
      .update({
        name: name ? name : userGoalData.name,
        type: type ? type : userGoalData.type,
        time: time ? time : userGoalData.time,
        distance: distance ? distance : userGoalData.distance,
        reps: reps ? reps : userGoalData.reps,
        muscle_group: muscle_group ? muscle_group : userGoalData.muscle_group,
        weight: weight ? weight : userGoalData.weight,
        notes: notes ? notes : userGoalData.notes,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_USER_GOAL",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "GET",
      action: "UPDATE_USER_GOAL",
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
    user_id,
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
      !user_id
    ) {
      createLog({
        method: "POST",
        action: "CREATE_USER_GOAL",
        status_code: 400,
        user_id: user_id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("user_goals")
      .insert({
        name: name,
        type: type,
        time: time,
        distance: distance,
        reps: reps,
        muscle_group: muscle_group,
        weight: weight,
        notes: notes,
        user_id: user_id,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "CREATE_USER_GOAL",
        status_code: 200,
        user_id: user_id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "GET",
      action: "CREATE_USER_GOAL",
      status_code: 500,
      user_id: user_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getWorkoutsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("user_workouts").select("*").where("user_id", id);
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
        action: "UPDATE_USER_WORKOUT",
        status_code: 400,
        user_id: id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const userWorkoutData = await db("user_workouts")
      .select("*")
      .where("id", id);
    if (!userWorkoutData) {
      createLog({
        method: "POST",
        action: "UPDATE_USER_WORKOUT",
        status_code: 400,
        user_id: id,
        metadata: { message: "goal does not exist" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("user_workouts")
      .select("*")
      .where("id", id)
      .update({
        name: name ? name : userWorkoutData.name,
        type: type ? type : userWorkoutData.type,
        time: time ? time : userWorkoutData.time,
        distance: distance ? distance : userWorkoutData.distance,
        reps: reps ? reps : userWorkoutData.reps,
        muscle_group: muscle_group
          ? muscle_group
          : userWorkoutData.muscle_group,
        weight: weight ? weight : userWorkoutData.weight,
        notes: notes ? notes : userWorkoutData.notes,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "UPDATE_USER_WORKOUT",
        status_code: 200,
        user_id: id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "UPDATE_USER_WORKOUT",
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
    user_id,
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
      !user_id
    ) {
      createLog({
        method: "POST",
        action: "CREATE_USER_WORKOUT",
        status_code: 400,
        user_id: user_id,
        metadata: { message: "bad data" },
      });
      return res.status(400).json({ message: "bad data" });
    }
    const result = await db("user_workouts")
      .insert({
        name: name,
        type: type,
        time: time,
        distance: distance,
        reps: reps,
        muscle_group: muscle_group,
        weight: weight,
        notes: notes,
        user_id: user_id,
      })
      .returning("*");
    if (result) {
      createLog({
        method: "POST",
        action: "CREATE_USER_WORKOUT",
        status_code: 200,
        user_id: user_id,
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result[0]);
  } catch (err) {
    createLog({
      method: "GET",
      action: "CREATE_USER_WORKOUT",
      status_code: 500,
      user_id: user_id,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const result = await db("user_events").select("*");
    createLog({
      method: "GET",
      action: "FETCH_ALL_USER_EVENTS",
      status_code: 200,
      user_id: null,
      metadata: JSON.stringify(result),
    });
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_ALL_USER_EVENTS",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getEventsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("user_events").select("*").where("user_id", id);
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

const createEvent = async (req, res) => {
  const { name, date, time, user_id } = req.body;
  if (!name || !date || !user_id) {
    return res
      .status(400)
      .send({ message: "name, date, and user_id are required" });
  }
  try {
    const [newEvent] = await db("user_events")
      .insert({ name, date, time: time || null, user_id })
      .returning("*");
    createLog({
      method: "POST",
      action: "CREATE_USER_EVENT",
      status_code: 201,
      user_id,
      metadata: JSON.stringify(newEvent),
    });
    res.status(201).send(newEvent);
  } catch (err) {
    createLog({
      method: "POST",
      action: "CREATE_USER_EVENT",
      status_code: 500,
      user_id,
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
  updateGoalsById,
  createGoal,
  getWorkoutsById,
  updateWorkoutById,
  createWorkout,
  getAllEvents,
  getEventsById,
  createEvent,
  updateById,
  createUser,
  updateRivalById,
  removeRivalById,
};
