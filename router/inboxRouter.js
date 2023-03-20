// external imports
const express = require("express");

// internal imports
const {
    getConversations,
    addConversation,
    getMessages,
    sendMessage,
  } = require("../controller/inboxController");

const { checkLogin } = require("../middlewares/common/checkLogin");
const router = express.Router();
// add conversation
router.post("/conversation", checkLogin, addConversation);

// get conversations
router.get("/conversation",checkLogin,getConversations);

// get messages
router.get("/messages",checkLogin,getMessages);

// post messages
router.post("/messages",checkLogin,sendMessage);

module.exports = router;