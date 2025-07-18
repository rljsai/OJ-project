import user from "../models/user.js";
import jwt from 'jsonwebtoken';
import problem from "../models/problem.js";
import dotenv from 'dotenv';
dotenv.config();

export const addproblem = async (req,res) =>{
    try{
        const {title,description,difficulty,testcases}=req.body;
        const Newproblem = await problem.create({
            title:title,
            description:description,
            difficulty:difficulty,
            testcases:testcases
        });
        res.status(200).json({ message: 'you have problem added successfully' });
    }catch(error){
        console.log("Server error in adding problem ",error.message);
         res.status(500).json(
                {
                    message:" server error in adding problem",
                    error:error.message,
                });
    }
}

export const getallproblems = async(req,res)=>{
    try{
        const allproblems=await problem.find({});
        res.status(200).json(allproblems);
    }catch(error){
         res.status(500).json(
                {
                    message:" server error in fetching problems",
                    error:error.message,
                });
    }
}

export const deleteproblem = async(req,res)=>{
    try{
        const {id}=req.params;
        const deletedproblem = await problem.findByIdAndDelete(id);
        if(!deletedproblem){
            return res.status(404).json({message:"problem not found"});
        }
        res.status(200).json({message:"problem deleted successfully"});
    }catch(error){
         res.status(500).json(
                {
                    message:" server error in deleting problem",
                    error:error.message,
                });
    }
}

export const getproblem = async(req,res)=>{
    try{
        const {id}=req.params;
        const requestedproblem = await problem.findById(id);
        if(!requestedproblem){
            return res.status(404).json({message:"problem not found"});
        }
        res.status(200).json(requestedproblem);
    }catch(error){
         res.status(500).json(
                {
                    message:" server error in fetching problem",
                    error:error.message,
                });
    }
}

export const modifyproblem = async(req,res)=>{
    try{
        const {id}=req.params;
        const updates=req.body;
        const updatedproblem = await problem.findByIdAndUpdate(id,updates,{
            new:true,
            runValidators:true,
        });
        if(!updatedproblem){
            return res.status(404).json({message:"problem not found"});
        }

        res.status(200).json({message:"problem updated successfully"});
    }catch(error){
         res.status(500).json(
                {
                    message:" server error in updating problem",
                    error:error.message,
   
                     });
    }
}
