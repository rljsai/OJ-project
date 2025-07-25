import mongoose from "mongoose";

const userschema= new mongoose.Schema({
   username :{
    type:String,
    required:true,
    default:null,
     unique:true,
   },
  password :{
    type:String,
    required:true,
    
   },
   email :{
    type:String,
    required:true,
    default:null,
    unique:true,
   },
   role:{
    type:String,
    enum: ['user', 'admin'], 
    default: 'user' ,
   },
    passwordResetToken: {
      type: String,
      default:undefined,
   },
   passwordResetExpires: {
      type: Date,
      default:undefined,
   }

});

const user=mongoose.model("User",userschema);
export default user;