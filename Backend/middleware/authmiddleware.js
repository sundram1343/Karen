const jwt=require('jsonwebtoken');
const User=require('../models/user-model');
const protect=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:'Not authorized'});
    }
    try{
        const decoded=jwt.verify(token,process.env.SECRET);
        req.user=await User.findById(decoded.id).select('-password');
        next();
    }catch(error){
        return res.status(401).json({message:'Not authorized'});
    }
}
module.exports={protect};