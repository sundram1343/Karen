const mongoose=require('mongoose');
const chatSchema=new mongoose.Schema({
    message:{
        type:mongoose.Schema.ObjectId,
        ref:'Message',
    },
    name:String,
    User:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
    }
});
const Chat=new mongoose.model('Chat',chatSchema);
module.exports=Chat;