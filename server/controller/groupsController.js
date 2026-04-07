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

module.exports = { getAll, getById };
