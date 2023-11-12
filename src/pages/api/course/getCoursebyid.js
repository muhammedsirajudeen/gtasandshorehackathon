// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import courseModel from "../../../../model/courseModel"
import mongoose from "mongoose"
const { ObjectId } = require('mongodb');

//only use this as a base line image dont forget to put entire thing in try catch blocks
import connectDB from "../../../../helper/dbConnect"
export default async function handler(req, res) {
    if(mongoose.connection.readyState===0){
      await connectDB()
  }
  try{
    const session=await getServerSession(req,res,authOptions)
    if(session){
      console.log(session.user.name)
      console.log(req.body.id)
      let doc=await courseModel.findOne({_id:req.body.id})
      res.status(200).json({message:"success",course:doc})
    } else{
      console.log("no session")
      res.status(200).json({message:"no session"})
    }

  }catch(error){
    console.log(error)
    res.status(200).json({message:"error occured"})
  }
}