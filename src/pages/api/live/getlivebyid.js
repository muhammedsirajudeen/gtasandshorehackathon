// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import mongoose from "mongoose"
import connectDB from "../../../../helper/dbConnect"
import liveModel from "../../../../model/liveModel"
//only use this as a base line image dont forget to put entire thing in try catch blocks
export default async function handler(req, res) {
    if(mongoose.connection.readyState===0){
      await connectDB()
  }
    try{
        const session=await getServerSession(req,res,authOptions)
        if(session){
            //from here we store the details to the redis instance or any instance
            const id=req.body.id
            let doc=await liveModel.findOne({_id:id})
            res.status(200).json({ message:"success",live:doc  })
        } else{
        console.log("no session")
        res.status(200).json({message:"no session"})
        }
    
    }catch(error){
        console.log(error)
        res.status(200).json({message:"error"})
    }

}