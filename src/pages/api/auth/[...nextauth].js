import NextAuth from "next-auth/next"

//add providers here
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/serverhelper/prisma"
const { v4: uuidv4 } = require('uuid');

export const authOptions = {
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }),
        //add provider here
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                username:{label:"Username",type:"text",placeholder:"siraj123"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials,req){
                //custom signin logic here
                try{
                    let user=await prisma.user.findFirst({where:{
                        username:credentials.username,
                        password:credentials.password
                    }})   
                    if(user.password===credentials.password && user.username===credentials.username){
                        return user
                    }else{
                        return null
                    }
                    
    
                }catch(error){
                    console.log(error)
                    return null
                }
            }
            
        })
    ],
    secret:process.env.JWT_SECRET,
 
    callbacks:{
        async signIn({user,account,profile,email,credentials}){
            if(account.provider==="google"){
                try{
                    
                    //checking if user exists in the database
                    let dbUser=await prisma.user.findFirst({where:{username:user.email}})
                    if(dbUser){
                        user.id=dbUser.id
                        return true
                    }else{
                        user.id=uuidv4()
                        await prisma.user.create(
                            {
                                data:{
                                    id:user.id,
                                    username:user.email,
                                    password:"google_provider"
                                }
                            }
                        )
                        return true
                    }

                }catch(error){
                    console.log(error)
                    return false
                }
            }
            return true
        },
        async session({session,token,user}){
            session.user.name=token.username
            return session
        },
        async jwt({token,account,profile}){
                let user=await prisma.user.findUnique({where:{id:token.sub}})
                token.username=user.username 

            return token
        },
        async redirect(url,baseUrl){
            return '/home'
        }
    }
}

export default NextAuth(authOptions)