import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "@/components/Navbar"
import Tag from "@/components/Tag"
import { PulseLoader } from "react-spinners"
export default function Courseupload(){
    const [faculty,setFacultystatus]=useState(false)
    const [currentTag,setcurrentTag]=useState("")

    const [coursename,setCoursename]=useState("")
    const [coursedescription,setcourseDesciption]=useState("")

    const [levelonename,setLevelonename]=useState()
    const [levelonedescription,setLevelonedescription]=useState("")
    
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        async function getfacultyStatus(){
            let response=(await axios.get("/api/getResource/getfacultyStatus")).data
            console.log(response)
            if(response.facultystatus){
                setFacultystatus(true)

            }else{
                window.location.href="/profileinsights"
            }
        }
        getfacultyStatus()
    },[])
    async function uploadHandler(){
        setLoading(true)
        console.log("upload to server")
        let levelonefile=document.querySelector("#level1").files[0]
  

        let formData=new FormData()
        formData.append('file',levelonefile)
        formData.append('tagline',currentTag)
        formData.append('coursedescription',coursedescription)
        formData.append('coursename',coursename)

        let response=(await axios.post("/api/upload/uploadcourse",formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })).data
        console.log(response.message)
        if(response.message==="success"){
            setLoading(false)
        }else{
            alert(response.message)
        }


    }
    return(
    <div className="w-screen h-screen flex flex-col justify-start items-center">
    <Navbar />
    <div className="border rounded-lg p-8 flex flex-col items-center justify-start max-w-md mt-8">
        <Tag setcurrentTag={setcurrentTag} />

        <input className="w-full border border-black mt-5 p-2" type="text" placeholder="Enter course name" value={coursename} onChange={(e)=>setCoursename(e.target.value)} />
        <input className="w-full border border-black mt-5 p-2 text-xs h-20" type="text" placeholder="Enter course description" value={coursedescription} onChange={(e)=>setcourseDesciption(e.target.value)}  />
        <p className="mt-5">Minimum 3 levels of modules are required</p>

        {/* Level 1 */}
        <div className="w-full mt-5">
            <p className="w-full text-center m-2 font-bold">course video</p>
            <p className="w-full text-center m-2 text-xs">Upload Course Video</p>
            <input type="file" id="level1" className="w-full text-xs mt-2" />
        </div>

    
        <button onClick={uploadHandler} className=" w-30 h-10 rounded-lg  bg-black text-white">upload</button>
        {loading? <PulseLoader loading={loading}/> :<></> }
    </div>
</div>

    )
}