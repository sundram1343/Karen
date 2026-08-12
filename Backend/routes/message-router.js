const express=require('express');
const router=express.Router();
const {sendmessage}=require('../controllers/message-controller');
const {protect}=require('../middleware/authmiddleware');
router.post('/send',protect,sendmessage);
module.exports=router;