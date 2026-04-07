const express = require("express");
const { registerUser, login } = require("../controller/authController");
const router = express();

router.post("/register", registerUser);
router.post("/login", login);

module.exports = router;
