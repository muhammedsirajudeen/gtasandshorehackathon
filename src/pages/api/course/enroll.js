// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import mongoose from "mongoose"
import connectDB from "../../../../helper/dbConnect"
import courseModel from "../../../../model/courseModel"
import profileModel from "../../../../model/profileModel"
//only use this as a base line image dont forget to put entire thing in try catch blocks

export default async function handler(req, res) {
    if(mongoose.connection.readyState===0){
      await connectDB()
  }
  try{
    const session=await getServerSession(req,res,authOptions)
    if(session){
        let doc=await courseModel.findOne({_id:req.body.id})
        console.log(session.user.name)
        console.log(doc.coursename)
        let profile=await profileModel.findOne({username:session.user.name})
        console.log(profile)
        if(profile){
          //logic to add to existing model
          let courses=profile.enrolledcourses
          courses.push({coursename:doc.coursename})
          await profileModel.findOneAndUpdate({username:session.user.name},{enrolledcourses:courses})
        }else{
          console.log("here")
          await profileModel.create({username:session.user.name,enrolledcourses:[{coursename:doc.coursename}]})
          
        }
       

        res.status(200).json({ name: session.user.name })

    } else{
      console.log("no session")
      res.status(200).json({message:"no session"})
    }
   
  }catch(error){
    console.log(error)
    res.status(200).json({message:"error"})
  }

}