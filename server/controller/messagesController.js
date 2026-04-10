const db = require("../db/db");
const { createLog } = require("../support/createLog");

const getGroupMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await db("messages")
      .join("users", "messages.user_id", "users.id")
      .where("messages.group_id", id)
      .orderBy("messages.created_at", "asc")
      .select(
        "messages.id",
        "messages.text",
        "messages.user_id",
        "messages.created_at",
        "users.first_name",
        "users.last_name",
        "users.rank",
      );
    res.status(200).json(messages);
  } catch (err) {
    createLog({
      method: "GET",
      action: "GET_GROUP_MESSAGES",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).json({ message: String(err) });
  }
};

const getDMMessages = async (req, res) => {
  const { userA, userB } = req.params;
  try {
    const messages = await db("messages")
      .join("users", "messages.user_id", "users.id")
      .where(function () {
        this.where("messages.user_id", userA).andWhere(
          "messages.to_user_id",
          userB,
        );
      })
      .orWhere(function () {
        this.where("messages.user_id", userB).andWhere(
          "messages.to_user_id",
          userA,
        );
      })
      .orderBy("messages.created_at", "asc")
      .select(
        "messages.id",
        "messages.text",
        "messages.user_id",
        "messages.to_user_id",
        "messages.created_at",
        "users.first_name",
        "users.last_name",
        "users.rank",
      );
    res.status(200).json(messages);
  } catch (err) {
    createLog({
      method: "GET",
      action: "GET_DM_MESSAGES",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).json({ message: String(err) });
  }
};

const sendMessage = async (req, res) => {
  const { text, user_id, group_id, to_user_id } = req.body;
  if (!text?.trim() || !user_id)
    return res.status(400).json({ message: "text and user_id required" });
  try {
    const [message] = await db("messages")
      .insert({
        text: text.trim(),
        user_id,
        group_id: group_id || null,
        to_user_id: to_user_id || null,
      })
      .returning("*");
    createLog({
      method: "POST",
      action: "SEND_TEXT",
      status_code: 200,
      user_id: user_id,
      metadata: JSON.stringify(message),
    });
    res.status(201).json(message);
  } catch (err) {
    createLog({
      method: "GET",
      action: "SEND_TEXT",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).json({ message: String(err) });
  }
};

module.exports = { getGroupMessages, getDMMessages, sendMessage };
