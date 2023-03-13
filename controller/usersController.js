// external imports 
const bcrypt = require("bcrypt")
const {unlink} = require("fs")
const path = require("path")

// internal imports
const User = require("../models/People")

// get users
async function getUsers(req,res,next){
    try{
        const users = await User.find();
        res.status(200).json({
            success: true,
            response_code: 200,
            users: users.map(user => {
                return {
                    name: user.name,
                    id: user._id,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role,
                    url: `http://localhost:${process.env.PORT}/profile/${user.avatar}`
                }
            })
        })
    }catch(err){
        next(err)
    }
}


// add user
async function addUser(req,res,next){
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.image.length)
    if(req.body.image.length > 0){
        newUser = new User({
            ...req.body,
            avatar: res.locals.fileName,
            password: hashedPassword
        });
    }else{
        newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
    }
    try {
        const result = await newUser.save();
        res.status(200).json({
            success: true,
            response_code: 200,
            data: {
                "name":result.name,
                "email": result.email,
                "mobile": result.mobile,
                "avatar": result.avatar,
                "role": result.role,
                "url": res.locals.url
            }
        })
    }catch(err){
        res.status(500).json({
            error: err
        })
    };
}

// remove user
async function removeUser(req,res,next){
    try{
        const user = await User.findByIdAndDelete({
            _id: req.params.id,
        })

        if(user.avatar){
            unlink(
                path.join(__dirname, `/../public/uploads/avatar/${user.avatar}`),
                (err) => {
                    if(err) console.log(err)
                }
            );
        }

        res.status(200).json({message: "User removed successfully!"});
    }catch(err){
        next(err)
    }
}


module.exports = {
    addUser,
    getUsers,
    removeUser
}