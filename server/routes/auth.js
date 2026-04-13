const express = require("express");
const { registerUser, login, logout } = require("../controller/authController");
const { checkIfStillLoggedIn } = require("../controller/loggedInController"); // added for cookie session!!!!!!!!!!!!
const router = express();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/login/check", checkIfStillLoggedIn); // added for cookie session!!!!!!!!!!!!
router.post("/logout", logout);

module.exports = router;
