// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
export default async function handler(req, res) {
  const session=await getServerSession(req,res,authOptions)
  if(session){
    console.log(session.user.name)
  } else{
    console.log("no session")
  }
  res.status(200).json({ name: session.user.name })
}
