const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    sender:{
        type:String,
        required:true,
    },
    chat:{
        type:mongoose.Schema.ObjectId,
        ref:'Chat',
        required:true,
    },
    content:String
});
const Message=new mongoose.model('Message',messageSchema);
module.exports=Message;