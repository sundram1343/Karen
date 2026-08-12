require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const authRouter =require('./routes/auth-router');
const messageRouter=require('./routes/message-router')
const connectDB=require('./config/DB')
app.use(cors());
app.use(express.json());
connectDB();
app.use('/auth',authRouter);
app.use('/message',messageRouter);
app.listen(process.env.PORT,()=>{
    console.log('Server is running');
})