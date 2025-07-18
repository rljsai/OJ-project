import mongoose from "mongoose";
import Submission from '../models/submission.js';
import User from '../models/user.js';      
import Problem from '../models/problem.js'; 

export const getallsubmissions = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const allsubmissions = await Submission.find({
        username: new mongoose.Types.ObjectId(userId)
      })
        .populate({
          path: 'problem',
          select: '_id title difficulty'
        })
        .sort({ createdAt: -1 });
  
      res.status(200).json({submissions: allsubmissions});
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  };

  

export const getsubmissionbyid = async(req,res)=>{

    try{
        const id=req.user.id;
        const questionId=req.query.questionId
        if (!questionId) {
            return res.status(400).json({ message: "Missing questionId in query params" });
          }
        const submissions=await Submission.find({username:id,problem:questionId}).sort({ createdAt: -1 });
        res.status(200).json(submissions);
    }catch(error){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }

}