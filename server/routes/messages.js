const express = require("express");
const { getGroupMessages, getDMMessages, sendMessage } = require("../controller/messagesController");
const router = express();

router.get("/group/:id", getGroupMessages);
router.get("/dm/:userA/:userB", getDMMessages);
router.post("/", sendMessage);

module.exports = router;
