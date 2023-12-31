// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import mongoose from "mongoose"
import connectDB from "../../../../helper/dbConnect"
//only use this as a base line image dont forget to put entire thing in try catch blocks
import prisma from "@/serverhelper/prisma"
export default async function handler(req, res) {
    if(mongoose.connection.readyState===0){
      await connectDB()
  }
  try{
    const session=await getServerSession(req,res,authOptions)
    if(session){
      console.log(session.user.name)
      let doc=await prisma.user.findMany()
        console.log(doc)
      res.status(200).json({ message:"success" , users:doc })
    } else{
      console.log("no session")
      res.status(200).json({message:"no session"})
    }
   
  }catch(error){
    console.log(error)
    res.status(200).json({message:"error"})
  }

}