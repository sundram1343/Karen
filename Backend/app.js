require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const authRouter =require('./routes/auth-router');
const messageRouter=require('./routes/message-router')
const connectDB=require('./config/DB')
const path=require('path');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB();
app.use('/auth',authRouter);
app.use('/message',messageRouter);
app.listen(process.env.PORT,()=>{
    console.log('Server is running');
})