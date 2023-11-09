import prisma from "@/serverhelper/prisma"
export default async function Handler(req,res){
    
    if(req.method==="POST"){
        const user=req.body
        console.log(user)
        try{
            let userExists=await prisma.user.findFirst({
                where:{
                    username:user.username,
                    password:user.password
                }
            })
            console.log(userExists)
            if(userExists){
                res.status(200).json({message:"user already exists"})
            }else{
                await prisma.user.create({data:user})
                res.status(200).json({message:"success"})

            }
        }catch(error){
            console.log(error)
            res.status(501).json({message:"error occured"})

        }
    }
    
}