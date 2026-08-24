const Message=require('../models/message-model');
const Chat=require('../models/chat-model');
const User=require('../models/user-model');
const path = require('path');
const {message}= require('../config/groq-config')
const sendmessage = async (req, res) => {
  try {
    let { usermessage, chatid } = req.body;
    const userid = req.user._id.toString();
    if (!usermessage && !req.file) {
      return res.status(400).json({ message: 'Message content or file is required' });
    }
    if(!chatid){
        const chat=await Chat.create({
            user:userid,
            name:req.file?req.file.originalname:usermessage.substring(0,20),
        });
        chatid=chat._id;
        await User.findByIdAndUpdate(userid, {
            $push: { chats: chatid }
        });
    }
    const filepath = req.file ? path.join(__dirname, '..', 'uploads', userid, req.file.filename) : null;
    const responsemessage = await message(usermessage || '', filepath);
    const newusermessage = await Message.create({
      chat: chatid,
      content: usermessage || '',
      file: req.file ? {
        filename: req.file.originalname,
        path: `/uploads/${userid}/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null,
      sender: 'user',
    });
    const newAImessage = await Message.create({
      chat: chatid,
      content: responsemessage,
      sender: 'Karen',
    });
    await Chat.findByIdAndUpdate(chatid, {
      $push: { messages: { $each: [newusermessage._id, newAImessage._id] } }
    });
    return res.status(200).json({ message: 'Message Sent Successfully', chatid, newusermessage, newAImessage });
  } catch (error) {
    console.error("sendmessage error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
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