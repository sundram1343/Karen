const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    user_message:{
        type:Boolean,
        default:false
    },
    AI_message:{
        type:Boolean,
        default:true
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