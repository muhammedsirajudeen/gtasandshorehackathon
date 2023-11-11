// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
//only use this as a base line image dont forget to put entire thing in try catch blocks
import mongoose from "mongoose"
import connectDB from "../../../../helper/dbConnect"
import facultyModel from "../../../../model/facultyModel"
export default async function handler(req, res) {
    if(mongoose.connection.readyState===0){
        await connectDB()
    }
    try{
        const session=await getServerSession(req,res,authOptions)
        if(session){
            console.log(session.user.name)
        } else{
            console.log("no session")
        }
        let faculty=await facultyModel.findOne({username:session.user.name})
        console.log(faculty)
        res.status(200).json({ message:"success",facultystatus:faculty.faculty})
    }catch(error){
        console.log(error)
        res.status(200).json({message:"error"})
    }

}