const express=require('express');
const router=express.Router();
const {sendmessage, getChats, getChatHistory}=require('../controllers/message-controller');
const {protect}=require('../middleware/authmiddleware');
router.post('/send',protect,sendmessage);
router.get('/chats',protect,getChats);
router.get('/chat/:chatid',protect,getChatHistory);
module.exports=router;