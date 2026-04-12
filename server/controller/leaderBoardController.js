const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getBestRun = async (req, res) => {
  try {
    const result = await db('user_workouts')
      .where('name', '2-Mile Run')
      .orderBy('time', 'asc');

    if (result) {
      createLog({method: "GET",action: "FETCH_BEST_RUNS",status_code: 200,user_id: null,metadata: JSON.stringify(result),});
    }
    res.status(200).send(result);

  } catch(err) {

    createLog({method: "POST",action: "FETCH_BEST_RUNS",status_code: 500,user_id: null,metadata: err,});
    res.status(500).send({ message: err });

  }
};

const getBestSitUps = async (req, res) => {
  try {
    const result = await db('user_workouts')
      .where('name', '1-Minute Sit-ups')
      .orderBy('reps', 'desc');
    if (result) {
      createLog({method: "GET",action: "FETCH_BEST_SITUPS",status_code: 200,user_id: null,metadata: JSON.stringify(result),});
    }
    res.status(200).send(result);
  } catch(err) {

    createLog({method: "POST",action: "FETCH_BEST_SITUPS",status_code: 500,user_id: null,metadata: err,});
    res.status(500).send({ message: err });

  }
};

const getBestPushUps = async (req, res) => {
  try{
    const result = await db('user_workouts')
      .where('name', '1-Minute Push-ups')
      .orderBy('reps', 'desc');
    if(result) {
      createLog({method: "GET",action: "FETCH_BEST_PUSHUPS",status_code: 200,user_id: null,metadata: JSON.stringify(result),});
    }
    res.status(200).send(result);
  }catch(err){
    createLog({method: "POST",action: "FETCH_BEST_PUSHUPS",status_code: 500,user_id: null,metadata: err,});
    res.status(500).send({ message: err });
  }
};

module.exports = { getBestRun, getBestSitUps, getBestPushUps };