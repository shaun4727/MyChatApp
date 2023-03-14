const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
    console.log(req.signedCookies);
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if(cookies){
        // try {
        //     token = cookies[process.env.COOKIE_NAME];
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
        // }
        next()
    }else{
        res.status(401).json({
            error: "Authentication failure!",
        })
    }
}

module.exports = {checkLogin}