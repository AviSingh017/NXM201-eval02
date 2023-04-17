const express = require("express");
const UserRoute = express.Router();

const {Usermodel} = require("../models/usermodel");
const {Blacklist} = require("../config/Blacklist");
const {authentication} = require("../middlewares/authentication");
const {authorise} = require("../middlewares/authorise");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

UserRoute.post("/signup",async(req,res)=>{

    const {name,email,pass,role} = req.body;

    try{
        bcrypt.hash(pass,7,async(err,hash)=>{
            if(err){
                res.status(404).send({"msg": "Unable to register the user"});
            }
            else{
                const user = new Usermodel({name,email,pass:hash,role});
                await user.save();
                res.status(200).send({"msg": "New User Registered Successfully"});
            }
        });
    }
    catch(err){
        res.status(404).send({"err":err.message});
    }
});

UserRoute.post("/login",async(req,res)=>{

    const {email,pass} = req.body;

    try{
        const user = await Usermodel.find({email});

        if(!user){
            res.status(404).send({"msg": "User is not yet Registered"});
        }

        const HassedPass = user[0]?.pass;
        if(user.length>0){
            bcrypt.compare(pass,HassedPass,(err,result)=>{
                if(result){
                    let AccessToken = jwt.sign({userID: user[0]._id}, process.env.secret, {expiresIn:"1m"});
                    let RefreshToken = jwt.sign({userID: user[0]._id}, process.env.DoubleSecret, {expiresIn:"3m"});

                    res.status(200).send({"msg": "LoggedIn Successfuly", "token":AccessToken, "Rtoken":RefreshToken});
                }
            });
        }
    }
    catch(err){
        res.status(404).send({"err": err.message});
    }
});

UserRoute.get("/logout",async(req,res)=>{
    try{

        const token = req.headers.authorization?.split(" ")[1];
        const BlacklistedToken = new Blacklist({token});
        await BlacklistedToken.save();

        res.status(200).send({"msg": "Logged Out Successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(404).send({"err": err.message});
    }
});

UserRoute.get("/refresh-token",async(res,req)=>{

    const Rtoken = req.body.Rtoken;

    if(!Rtoken){
        return res.status(404).send({"msg": "Session Expired Please Login again."})
    }
    try{
        jwt.verify(Rtoken,process.env.DoubleSecret,(err,decode)=>{
            if(err){
                res.status(404).send({"msg": "Session Expired Please Login again."})
            }
            else{
                const AccessToken = jwt.sign({userID:user[0]._id},process.env.secret,{expiresIn:"1m"});
                res.status(404).send({"msg": "Successfully Loggedin.","token":AccessToken});
            }
        })
    }
    catch(err){
        res.status(404).send({"msg": "Your are not authorised"});
    }
});

module.exports={UserRoute};