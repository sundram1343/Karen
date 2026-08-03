const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/user-model');
const registeruser=async(req,res)=>{
    try{
        const {email,name,password}=req.body;
        const user=await User.findOne({emai});
        if(user){
            res.status(200).json({message:'User alreday exist'});
        }
        const hashedPassword=await bcrypt.hash(password,process.env.Salt_Rounds);
        await User.create({email,name,password:hashedPassword});
        const token=jwt.sign({id:user._id},`${process.env.SECRET}`);
        res.status(201).json({message:'User Created Successfully',token});
    } catch(error)
    {
        res.status(500).json({message:'Internal Server Error'});
    }
}
const loginuser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            res.status(300).json({message:'Invaid Credintials'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(300).json({message:'Invaid Credintials'});
        }
        const token=jwt.sign({id:user._id},`${process.env.SECRET}`);
        res.status(200).json({message:'User Logged In Successfully',token});
        }
    catch(error)
    {
        res.status(500).json({message:'Internal Server Error'});
    }
}
module.exports={registeruser,loginuser};