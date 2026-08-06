const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/user-model');
const registeruser=async(req,res)=>{
    try{
        const {email,name,password}=req.body;
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:'User already exists'});
        }
        const hashedPassword=await bcrypt.hash(password,parseInt(process.env.Salt_Rounds));
        const newUser = await User.create({ email, name, password: hashedPassword });
        const token=jwt.sign({id:newUser._id},`${process.env.SECRET}`);
        return res.status(201).json({message:'User Created Successfully',token});
    } catch(error)
    {
        console.error("Register Error:", error);
        return res.status(500).json({message:'Internal Server Error'});
    }
}
const loginuser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Invalid Credentials'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid Credentials'});
        }
        const token=jwt.sign({id:user._id},`${process.env.SECRET}`);
        return res.status(200).json({message:'User Logged In Successfully',token});
    }
    catch(error)
    {
        console.error("Login Error:", error);
        return res.status(500).json({message:'Internal Server Error'});
    }
}
module.exports={registeruser,loginuser};