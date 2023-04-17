const authorise = (permittedrole)=>{
    return (req,res,next)=>{
        const UserRole = req.user.role;
        if(permittedrole.includes(UserRole)){
            next();
        }
        else{
            res.status(404).send({"msg": "You are Unauthorised"});
        }
    }
}

module.exports={authorise};
