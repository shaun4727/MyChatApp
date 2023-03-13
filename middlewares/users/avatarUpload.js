
const base64Img = require("base64-img")

function avatarUpload(req,res,next){
    const {image} = req.body;
    
    // File upload folder
    const UPLOADS_FOLDER = `${__dirname}/../../public/uploads/avatar/`;
    try{
        base64Img.img(image,UPLOADS_FOLDER,Date.now(), (err,filepath)=>{
            const pathArr = filepath.split('\\');
            const fileName = pathArr[pathArr.length - 1];
            res.locals.fileName = fileName;
            res.locals.url = `http://localhost:${process.env.PORT}/profile/${fileName}`;
        })

        next();
    }catch(err){
        res.status(400).json({
            "error": err
        })
    }
}

module.exports = avatarUpload;