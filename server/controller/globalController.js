const db = require("../db/db");

const getAll = async (req, res) => {
  try {
    const result = await db("global_events").select("*");
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = { getAll };
