const Message=require('../models/message-model');
const Chat=require('../models/chat-model');
const User=require('../models/user-model');
const {message}= require('../config/groq-config')
const sendmessage=async(req,res)=>{
    try{
        let {usermessage,chatid}=req.body;
        const userid=req.user._id;
        if(!usermessage){
            return res.status(400).json({message:'Message content is required'});
        }
        if(!chatid){
            const chatName = usermessage.length > 25 ? usermessage.substring(0, 25) + '...' : usermessage;
            const chat=await Chat.create({
                user:userid,
                name: chatName
            });
            await User.findByIdAndUpdate(userid,{$push:{chat:chat._id}});
            chatid=chat._id;
        } else {
            const existingChat = await Chat.findById(chatid);
            if (existingChat && !existingChat.name) {
                const chatName = usermessage.length > 25 ? usermessage.substring(0, 25) + '...' : usermessage;
                await Chat.findByIdAndUpdate(chatid, { name: chatName });
            }
        }
        const history =await Message.find({chat:chatid}).sort({createdAt:1}).limit(20).lean();
        const historyPayload = [
            { 
                role: "system", content: "You are Karen, a helpful assistant." },
                ...history.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.content,
            }
        )),
            { 
                role: 'user', content: usermessage 
            }
        ];
        const responsemessage= await message(historyPayload);
        const newusermessage=await Message.create({
            chat:chatid,
            content:usermessage,
            sender:'user',
        });
        const newAImessage=await Message.create({
            chat:chatid,
            content:responsemessage,
            sender:'Karen',
        }); 
        await Chat.findByIdAndUpdate(chatid,{ $push: { messages: { $each: [newusermessage._id, newAImessage._id] } } });
        return res.status(200).json({message:'Message Sent Successfully',chatid,newusermessage,newAImessage});
    }
    catch(error){
        console.error("sendmessage error:", error);
        return res.status(500).json({message:'Internal Server Error'});
    }
}
const getChats=async(req,res)=>{
    try{
        const userid=req.user._id;
        const chats=await Chat.find({user:userid}).sort({updatedAt:-1}).select('name _id updatedAt').limit(20).lean();
        return res.status(200).json({chats});
    }catch(error){
        console.error("getChats error:", error);
        return res.status(500).json({message:'Internal Server Error'});
    }
}
const getChatHistory=async(req,res)=>{
    try{
        const {chatid}=req.params;
        const messages=await Message.find({chat:chatid}).sort({createdAt:1});
        return res.status(200).json({messages});
    }catch(error){
        console.error("getChatHistory error:", error);
        return res.status(500).json({message:'Internal Server Error'});
    }
}
module.exports={sendmessage, getChats, getChatHistory};