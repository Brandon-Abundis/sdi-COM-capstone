const db = require("../db/db");
const bcrypt = require("bcrypt");
const { createLog } = require("../support/createLog");

const SALT_ROUNDS = 10;

const createUser = async (user) => {
  return db("users")
    .insert(user)
    .returning([
      "id",
      "email",
      "first_name",
      "last_name",
      "gender",
      "rank",
      "age",
    ]);
};

const registerUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, gender, rank, age } =
      req.body;
    const exists = await db("users").where({ email }).first();

    if (exists) {
      createLog({
        method: "POST",
        action: "CREATE_USER",
        status_code: 400,
        user_id: null,
        metadata: JSON.stringify({ message: "User already exists" }),
      });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashWord = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser({
      email,
      password: hashWord,
      first_name,
      last_name,
      gender,
      rank,
      age,
    });

    if (newUser) {
      createLog({
        method: "POST",
        action: "CREATE_USER",
        status_code: 201,
        user_id: newUser[0].id,
        metadata: JSON.stringify(newUser[0]),
      });
    }

    res.status(201).json(newUser[0]);
  } catch (err) {
    createLog({
      method: "POST",
      action: "CREATE_USER",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).json({ message: err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db("users").where({ email }).first();

    if (!user) {
      createLog({
        method: "POST",
        action: "LOGIN",
        status_code: 400,
        user_id: null,
        metadata: JSON.stringify({ message: "User does not exists" }),
      });
      return res.status(400).send({ message: "User does not exists" });
    }
    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      createLog({
        method: "POST",
        action: "LOGIN",
        status_code: 400,
        user_id: null,
        metadata: JSON.stringify({
          message: "You have entered the wrong password...",
        }),
      });
      return res
        .status(400)
        .send({ message: "You have entered the wrong password..." });
    }

    createLog({
      method: "POST",
      action: "LOGIN",
      status_code: 201,
      user_id: user.id,
      metadata: JSON.stringify(user),
    });

    res.status(200).json({
      id: user.id,
      email: email,
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender,
      rank: user.rank,
      age: user.age,
    });
  } catch (err) {
    createLog({
      method: "POST",
      action: "LOGIN",
      status_code: 500,
      user_id: null,
      metadata: err,
    });
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, login };
