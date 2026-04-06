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
    const groupData = await db("groups")
      .select("*")
      .whereRaw("? = ANY(string_to_array(user_ids, ','))", [id]);

    res.status(200).send(groupData);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = { getAll, getById, getGroupsById };
