const express = require("express");
const BlogRoute = express.Router();

const {Usermodel} = require("../models/usermodel");
const {Blogmodel} = require("../models/blogs");
const {Blacklist} = require("../config/Blacklist");
const {authentication} = require("../middlewares/authentication");
const {authorise} = require("../middlewares/authorise");
require("dotenv").config();

BlogRoute.post("/createblog", authentication, async(req,res)=> {
    try{
        const blogs = new Blogmodel(req.body);
        await blogs.save();
        res.status(200).send({"msg": "Blog has been posted on website!"});
    }
    catch(err){
        res.status(404).send({"err": err.message});
    }
});

BlogRoute.get("/blogslist", authentication, async(req,res)=>{
    try{
        const blogs = await Blogmodel.find()
        res.status(200).send(blogs);
    }
    catch(err){
        res.status(404).send({"err":err.message});
    }
});

BlogRoute.delete("/removeblog/:id", authorise(["moderator"]),async(req,res)=>{
    let id = req.params.id;
    try{
        await Blogmodel.findByIdAndDelete({_id:id});
        res.status(200).send({"msg": "Blog has been deleted!"});
    }
    catch(err){
        res.status(404).send({"err":err.message});
    }
});

BlogRoute.delete("/deleteblog/:id", authentication ,async(req,res)=>{
    let id = req.params.id;
    try{
        await Blogmodel.findByIdAndDelete({_id:id});
        res.status(200).send({"msg": "Blog has been deleted!"});
    }
    catch(err){
        res.status(404).send({"err":err.message});
    }
});

BlogRoute.patch("/updateblog/:id", authentication ,async(req,res)=>{
    let id = req.params.id;
    try{
        await Blogmodel.findByIdAndUpdate({_id:id},req.body);
        res.status(200).send({"msg": "Blog has been updated!"});
    }
    catch(err){
        res.status(404).send({"err":err.message});
    }
});

module.exports={BlogRoute};


