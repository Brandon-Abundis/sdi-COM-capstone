const db = require("../db/db");

const getAll = async (req, res) => {
  try {
    const result = await db("users").select("*");
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("users").select("*").where("id", id).first();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getGroupsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("groups").select("id", "user_ids");
    // const groupWithUserId = result.map((obj) => {
    //   const userIds = obj.user_ids.split(",");
    //   userIds.forEach((userId) => {

    //     if (userId === id) return obj;
    //   });
    //   return;
    // });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = { getAll, getById, getGroupsById };
