// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const fs = require("fs")
const cors = require("cors")
const {createServer} = require("http")
const {Server} = require("socket.io")


// internal imports
const {notFoundHandler,errorHandler} = require("./middlewares/common/errorHandler")
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: [`http://localhost:8081`,`http://localhost:8080`,`http://localhost:8082`],
        credentials: true
    }
 });
io.on("connection",(socket)=>{
    global.socket = socket;
})



dotenv.config();

// database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("database connection successful! ")).catch(err => console.log(err ))

 
// request parser
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: [`http://localhost:${process.env.PORT}`,`http://localhost:8080`,`http://localhost:8081`,`http://localhost:8082`,`http://192.168.2.17:8081`],
    credentials: true
}))


// set static folder
app.use(express.static(path.join(__dirname,"public")));

// get profile image
app.get('/profile/:path', (req,res)=>{
    res.sendFile(path.join(__dirname,'public/uploads/avatar',req.params.path))
})


// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/",loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);


//404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);







httpServer.listen(process.env.PORT, ()=> {
    console.log(`app listening to port ${process.env.PORT}`);
})