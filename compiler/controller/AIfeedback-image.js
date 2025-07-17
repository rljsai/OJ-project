import { generateAIResponse } from "../AIresponse.js";
export const aiFeedback = async(req,res)=>{

  const {code}=req.body;
  if(!code|| code.trim()===""){
     res.status(400).send({
        message:"Code is should not be empty"
    })
    return;
  }

  try{
     const response=await generateAIResponse(code);
     res.status(200).send({
        message:"AI Feedback generated successfully",
        feedback:response
     })
  }catch(error){
    res.status(500).send({
        message:"Internal server error",
        error:error.message
    })
  }
}