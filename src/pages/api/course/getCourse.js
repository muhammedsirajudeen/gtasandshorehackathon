// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

//only use this as a base line image dont forget to put entire thing in try catch blocks
import mongoose from "mongoose"
import connectDB from "../../../../helper/dbConnect"
import courseModel from "../../../../model/courseModel"
export default async function handler(req, res) {
    if(mongoose.connection.readyState===0){
      await connectDB()
  }
  try{
    const session=await getServerSession(req,res,authOptions)
    if(session){
       console.log(session.user.name)
       const {tag}=req.query 
       if(!tag){
        let doc=await courseModel.find()
        res.status(200).json({message:"success",courses:doc})
       }else{
        console.log(tag)
        let doc=await courseModel.find({tag:tag})
        res.status(200).json({message:"success",courses:doc})
 
       }
    } else{
      console.log("no session")
      res.status(200).json({message:"no session"})
    }
    res.status(200).json({ name: session.user.name })
    
  }catch(error){
    console.log(error)
    res.status(200).json({message:"error"})
  }

}