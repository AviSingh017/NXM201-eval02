const jwt = require("jsonwebtoken");
const {Blacklist} = require("../config/Blacklist");
const {Usermodel} = require("../models/usermodel");
require("dotenv").config();

const authentication = async(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];

    const isBlacklisted = await Blacklist.findOne({token});
    if(isBlacklisted){
        return res.status(404).send({"msg": "Token is Blacklisted."});
    }

    if(!token){
        res.status(404).send({"msg": "Session Expired Please Login again."});
    }

    if(token){
        jwt.verify(token,process.env.secret,async(err,decode)=>{
            if(decode){
                req.body.userID = decode.userID;
                const data = await Usermodel.findById({_id:decode.userID});
                req.user = data;
                if(!data){
                    return res.status(404).send({"msg": "You are Unauthorised"});
                }
                next();
            }
            else{
                res.status(404).send({"msg": "Session Expired Please Login again."})
            }
        });
    }
    else{
        res.status(404).send({"msg": "Session Expired Please Login again."});
    }
}

module.exports={authentication};