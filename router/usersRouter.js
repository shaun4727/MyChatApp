// external imports
const express = require("express")

// internal imports
const {addUser,getUsers,removeUser} = require("../controller/usersController")
const avatarUpload = require("../middlewares/users/avatarUpload")

const router = express.Router();

router.get("/",getUsers);
router.post("/",avatarUpload,addUser);
router.delete("/:id", removeUser);

module.exports = router;