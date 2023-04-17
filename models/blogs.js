const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
    title: {type: String, required:true},
    category: {type: String, required:true},
    domain: {type: String, required:true}
},{
    versionKey:false
});

const Blogmodel = mongoose.model("blog",BlogSchema);
module.exports={Blogmodel};