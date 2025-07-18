import mongoose from 'mongoose';


const submissionschema= new mongoose.Schema({
    language:{
        type:String,
        required:true,
    },
    verdict:{
        type:String,
        required:true,
    },
    score:{
        type:Number,
        require:false,
    },
    code:{
        type:String,
        required:true,
    },
    username:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    problem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Problem',
        required:true,
    }
},
{timestamps:true});

const submission=mongoose.model("Submission",submissionschema);
export default submission;
