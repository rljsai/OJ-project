import mongoose from "mongoose";

const testcaseschema =new mongoose.Schema({
    input:{
        type:String,
        required:true,
    },
    ExpectedOutput:{
        type:String,
        required:true,
    }
});


const problemschema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    difficulty:{
        type:String,
        required:true,
        enum:['Easy','Hard','Medium'],
    },
    testcases:[testcaseschema]
},
{timestamps:true});

const problem =mongoose.model("Problem",problemschema);
export default problem;

