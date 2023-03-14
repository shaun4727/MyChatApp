// external imports
const express = require("express")

// internal imports
const {addUser,getUsers,removeUser} = require("../controller/usersController")
const avatarUpload = require("../middlewares/users/avatarUpload")
const {checkLogin} = require("../middlewares/common/checkLogin")

const router = express.Router();

router.get("/",checkLogin,getUsers);
router.post("/",checkLogin,avatarUpload,addUser);
router.delete("/:id", checkLogin,removeUser);

module.exports = router;