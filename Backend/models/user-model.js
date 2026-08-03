const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    email:String,
    password:String,
    chat:[{
        type:mongoose.Schema.ObjectId,
        ref:'Chat',
    }],
})
const User=new mongoose.model('User',userSchema);
module.exports=User;