// external imports
const express = require("express")

// internal imports
const {login,logout} = require("../controller/loginController");

const router = express.Router();

// login functionality
router.post("/", login);

// logout
router.delete("/", logout);

module.exports = router;