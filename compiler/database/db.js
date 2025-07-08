import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DBconnection= async() =>{
    try{
       await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB is connected",);
    }catch(error){
        console.log("error connecting to MongoDB",error.message);
    }
}
export default DBconnection;
