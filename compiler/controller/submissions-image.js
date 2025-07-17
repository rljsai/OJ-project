import submission from '../models/submission.js';

export const getallsubmissions = async(req,res)=>{
     try{
        const {id}=req.user.id;
        const allsubmissions=await submission.find({username:id});
        res.status(200).json(allsubmissions);
     }catch(error){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
     }
}

export const getsubmissionbyid = async(req,res)=>{

    try{
        const {id}=req.user.id;
        const questionId=req.body.questionId
        const submission=await submission.find({username:id,problem:questionId});
        res.status(200).json(submission);
    }catch(error){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }

}