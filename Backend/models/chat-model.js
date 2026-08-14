const mongoose=require('mongoose');
const chatSchema=new mongoose.Schema({
    messages:[{
        type:mongoose.Schema.ObjectId,
        ref:'Message',
    }],
    name:String,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
    }
}, { timestamps: true });
const Chat=new mongoose.model('Chat',chatSchema);
module.exports=Chat;