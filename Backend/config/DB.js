const mongoose=require('mongoose')
const connectDB= async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/karen`);
        console.log("Connected Succesfully")
    }
    catch(error){
        console.log(error)
    }
}

module.exports=connectDB;