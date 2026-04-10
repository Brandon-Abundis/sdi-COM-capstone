const express = require("express");
const { registerUser, login } = require("../controller/authController");
const {checkIfStillLoggedIn} = require("../controller/loggedInController")// added for cookie session!!!!!!!!!!!!
const router = express();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/login/check", checkIfStillLoggedIn);// added for cookie session!!!!!!!!!!!!

module.exports = router;
