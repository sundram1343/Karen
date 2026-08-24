const express=require('express');
const router=express.Router();
const {sendmessage, getChats, getChatHistory}=require('../controllers/message-controller');
const {protect}=require('../middleware/authmiddleware');
const upload=require('../middleware/uploadmiddleware');
router.post('/send',protect,upload.single('file'),sendmessage);
router.get('/chats',protect,getChats);
router.get('/chat/:chatid',protect,getChatHistory);
module.exports=router;