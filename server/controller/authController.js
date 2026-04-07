const db = require("../db/db");
const bcrypt = require("bcrypt");

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

    res.status(201).json(newUser[0]);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(400).send({ message: "User does not exists" });
    }
    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      return res
        .status(400)
        .send({ message: "You have entered the wrong password..." });
    }
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
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, login };
