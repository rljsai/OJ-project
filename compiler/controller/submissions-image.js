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
        const id=req.user.id;
        const questionId=req.query.questionId
        if (!questionId) {
            return res.status(400).json({ message: "Missing questionId in query params" });
          }
        const submissions=await submission.find({username:id,problem:questionId}).sort({ createdAt: -1 });
        res.status(200).json(submissions);
    }catch(error){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }

}