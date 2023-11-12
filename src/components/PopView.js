import axios from "axios"
import { useState, useEffect } from "react"
import { PulseLoader } from "react-spinners"

export default function PopView({id,setOpen}){
    const [course,setCourse]=useState("")
    const [url,setUrl]=useState("")
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        async function getCoursebyid(){
            let response=(await axios.post("/api/course/getCoursebyid",{
                id:id
            })).data
            if(response.message==="success"){
                setCourse(response.course)
                setUrl(response.course.coursevideo)
                setLoading(false)
            }else{
                setLoading(false)
            }

        }
        getCoursebyid()
    },[])
    return(
        <div className="fixed flex top-0 bottom-0 justify-center items-center   w-screen h-screen border  rounded-lg ">
            <div className="flex justify-start flex-col bg-white border border-black  items-center w-96 h-96 overflow-x-scroll ">
            <buttton className="font-bold"  onClick={()=> setOpen(false) }> X </buttton>
          
            
                    <>
                    {url?<video controls width="640" height="360">
                    <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                        :
                        <PulseLoader loading={loading}/>
                        }
                    <div className="font-bold m-3"> COURSE NAME </div>
                    <div className="font-light"> {course?.coursename} </div>
                    <div className="font-bold m-3"> COURSE DESCRIPTION </div>

                    <div className="font-light"> {course?.coursedescription} </div>
                    <div className="font-bold m-3"> COURSE AUTHOR </div>

                    <div className="font-light"> {course?.courseauthor} </div>

                    <button className="bg-black text-white rounded-lg" >Mark as Completed</button>

                    </>

                    
    
            </div>
        </div>
    )
}