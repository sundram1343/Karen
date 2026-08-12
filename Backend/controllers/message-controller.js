const Message=require('../models/message-model');
const Chat=require('../models/chat-model');
const User=require('../models/user-model');
const {message}= require('../config/groq-config')
const sendmessage=async(req,res)=>{
    try{
        const {usermessage,chatid}=req.body;
        if(!usermessage){
            res.status(200).json({message:'All Fields are required'});
        }
        const responsemessage= await message(usermessage);
        if(!chatid){
            const chat=await Chat.create({
                user:[userid],
            });
            await User.findByIdAndUpdate(userid,{$push:{chat:chat._id}});
            chatid=chat._id;
        }
        const newusermessage=await Message.create({
            chat:chatid,
            content:usermessage,
            user_message:true,
        });
        const newAImessage=await Message.create({
            chat:chatid,
            content:responsemessage,
            AI_message:true,
        }); 
        await Chat.findByIdAndUpdate(chatid,{ $push: { messages: { $each: [newusermessage._id, newAImessage._id] } } });
        return res.status(200).json({message:'Message Sent Successfully'});
    }
    catch(error){
        return res.status(500).json({message:'Internal Server Error'});
    }
}
module.exports={sendmessage};