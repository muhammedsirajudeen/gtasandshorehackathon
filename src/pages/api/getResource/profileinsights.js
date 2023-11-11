// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import connectDB from "../../../../helper/dbConnect"
//only use this as a base line image dont forget to put entire thing in try catch blocks

import mongoose from "mongoose"

export default async function handler(req, res) {
    if(mongoose.connection.readyState===0){
        await connectDB()
    }
    const session=await getServerSession(req,res,authOptions)
    if(session){
        console.log(session.user.name)

    } else{
        console.log("no session")
    }
    res.status(200).json({ name: session.user.name })
}