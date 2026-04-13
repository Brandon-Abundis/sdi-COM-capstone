const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getAllScores = async (req, res) => {
  try {
    const result = await db("scores").select("*");

    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_SCORES",
        status_code: 200,
        user_id: null,
        metadata: { message: "fetched all scores" },
      });
    }
    res.status(200).send(result);
  } catch (err) {
    createLog({
      method: "GET",
      action: "FETCH_SCORES",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).send({ message: err });
  }
};

const getScoresById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("scores").select("*").where("user_id", id);
    if (result) {
      createLog({
        method: "GET",
        action: "FETCH_USER_SCORES",
        status_code: 200,
        user_id: result.id,
        metadata: { message: "fetched all scores user score" },
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

module.exports = { getAllScores, getScoresById };
