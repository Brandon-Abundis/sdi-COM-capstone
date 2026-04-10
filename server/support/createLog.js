const db = require("../db/db");

const createLog = async (log) => {
  if (Number(log.user_id)) {
    return await db("security_logs").insert(log);
  }
  log.user_id = null;
  return await db("security_logs").insert(log);
};

module.exports = { createLog };
