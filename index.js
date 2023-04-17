const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();
const {connection} = require("./config/database");
const {UserRoute} = require("./routes/userroute");
const {BlogRoute} = require("./routes/blogroute");
const { authentication } = require("./middlewares/authentication");

app.get("/",async(req,res)=>{
    res.send("Welcome to Blogger! ");
});

app.use("/user",UserRoute);

app.use(authentication);
app.use("/blog",BlogRoute);

app.listen(process.env.port, async()=>{
    try{
        await connection;
        console.log("Connected to Database");
    }
    catch(err){
        console.log(err);
        console.log(err.message);
    }
    console.log(`Server is running on port ${process.env.port}`);
});