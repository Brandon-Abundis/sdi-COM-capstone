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
        metadata: JSON.stringify(result),
      });
    }
    res.status(200).send(result);

  } catch(err) {
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

module.exports = { getAllScores };