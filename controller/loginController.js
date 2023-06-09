// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");

// do login
async function login(req,res,next){
    try{
        const user = await User.findOne({   
            $or: [{ email: req.body.username},{mobile: req.body.username}],
        });
        
        if(user && user._id){
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if(isValidPassword){
                const userObject = {
                    username: user.name,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role,
                    id: user._id
                }
                // generate token
                const token = jwt.sign(userObject,process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRY});
                // set cookie
                res.cookie(process.env.COOKIE_NAME,token,{maxAge: process.env.JWT_EXPIRY,httpOnly: true, signed: true});
                res.cookie("userEmail",userObject.email.split("@")[0],{maxAge: process.env.JWT_EXPIRY,httpOnly: true});

                res.status(200).json({
                    success: true,
                    response_code: 200,
                    data: {
                        ...userObject
                    }
                })
            }else{
                res.status(401).json({error: "Login credentials invalid!"})
            }
        }else{
            res.status(401).json({error: "Login credentials invalid!"})
        }
    }catch(err){
        res.status(403).json({error:err.message});
    }
}

// logout
function logout(req,res){
    res.clearCookie(process.env.COOKIE_NAME);
    res.clearCookie("userEmail");
    res.status(200).json({
        success: true,
        response_code: 200,
        message: "Logged Out"
    });
}

module.exports = {login,logout}