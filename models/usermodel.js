const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true, unique:true},
    pass: {type: String, required:true},
    role: {type: String, required:true, default:"user",enum:["user","moderator"]}
},{
    versionKey:false
});

const Usermodel = mongoose.model("user",UserSchema);
module.exports={Usermodel};