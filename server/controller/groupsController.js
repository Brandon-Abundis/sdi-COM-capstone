const db = require("../db/db");

const getAll = async (req, res) => {
  try {
    const result = await db("groups").select("*");
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("groups").select("*").where("id", id).first();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getGoalsById = async (req, res) => {
  const { id } = req.params;
  try {
    //uncomment these code when user_goals is ready
    // const result = await db("group_goals").select("*").where("group_id", id).first();
    // res.status(200).send(result);
    res
      .status(200)
      .send({ message: "you made it, the data you require is not ready yet" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getWorkoutsById = async (req, res) => {
  const { id } = req.params;
  try {
    //uncomment these code when user_goals is ready
    // const result = await db("group_workouts").select("*").where("group_id", id).first();
    // res.status(200).send(result);
    res
      .status(200)
      .send({ message: "you made it, the data you require is not ready yet" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getEventsById = async (req, res) => {
  const { id } = req.params;
  try {
    //uncomment these code when user_goals is ready
    // const result = await db("group_events").select("*").where("group_id", id).first();
    // res.status(200).send(result);
    res
      .status(200)
      .send({ message: "you made it, the data you require is not ready yet" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = {
  getAll,
  getById,
  getGoalsById,
  getWorkoutsById,
  getEventsById,
};
