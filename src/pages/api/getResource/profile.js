


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "@/serverhelper/prisma"

//only use this as a base line image dont forget to put entire thing in try catch blocks
//do note that the session.user.name in this context is the username work with that 
export default async function handler(req, res) {
    try{
      const session=await getServerSession(req,res,authOptions)
      console.log(session)
      if(session){
        let username=session.user.name
        console.log(username)
        let user=await prisma.user.findFirst(
          {
            where:{
              username:username
            }
          }
        )
        console.log(user)
        res.json({message:"success",username:user.username,profile:user.profilepicture})
      } else{
        console.log("no session")
        res.json({message:"session error"})
      }
     
    }catch(error){
      console.log(error)
      res.status(200).json({message:"error"})
    }

}


