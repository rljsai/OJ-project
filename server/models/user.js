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

});

const user=mongoose.model("User",userschema);
export default user;