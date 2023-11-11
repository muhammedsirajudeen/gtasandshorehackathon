// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import mongoose from "mongoose"
import connectDB from "../../../../helper/dbConnect"
//only use this as a base line image dont forget to put entire thing in try catch blocks
import multer from 'multer';
import { promisify } from 'util';
import formidable from "formidable";
import { json } from "body-parser";
import AWS from "aws-sdk";
import courseModel from "../../../../model/courseModel";

const upload = multer({
    storage: multer.memoryStorage(),
  });

export const config = {
    api: {
      bodyParser: false, // Disable the default bodyParser
    },
  };

  const S3 = new AWS.S3({
    accessKeyId: process.env.access_key,
    secretAccessKey: process.env.secret_access_key,
  });



export default async function handler(req, res) {
    try{
        if(mongoose.connection.readyState===0){
            await connectDB()
        }
        let tag;
        let coursedescription
        let coursename;
            const session=await getServerSession(req,res,authOptions)
            if(session){
            console.log(session.user.name)

            upload.single("file")(req, res, async (err) => {
              console.log(req.body.tagline)
              console.log("here")
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error uploading file" });
              }
      
              const { originalname, buffer, mimetype } = req.file;
              const key = `courses/${originalname}`;
      
              try {
                const params = {
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: key,
                  Body: buffer,
                  ContentType: mimetype,
                };
      
                let result=await S3.upload(params).promise();
                let newcourse=new courseModel(
                  {
                    coursename:req.body.coursename,
                    courseauthor:session.user.name,
                    coursedescription:req.body.coursedescription,
                    coursevideo:result.Location,
                    tag:req.body.tagline
                  }
                  )
                  await newcourse.save()
                res.status(200).json({ message: "success" });
              } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
              }
            });
          }
        else{
          console.log('no session')
          res.status(200).json({message:"no session"})
        }
      }catch(error){
        console.log(error)
        res.status(200).json({message:"error"})
      }


}