import mongoose from "mongoose";

const userschema= new mongoose.Schema({
   username :{
    type:String,
    required:true,
    defualt:null,
     unique:true,
   },
  password :{
    type:String,
    required:true,
    
   },
   email :{
    type:String,
    required:true,
    defualt:null,
    unique:true,
   },
   role:{
    type:String,
    enum: ['user', 'admin'], 
    default: 'user' ,
   },
   resetOtp: {
    type: String,
    default: undefined,
   },
   resetOtpExpires: {
    type: Date,
    default: undefined,
   }
   

});

const user=mongoose.model("User",userschema);
export default user;