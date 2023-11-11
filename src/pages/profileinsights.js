import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Profile(){
    const [image,setImage]=useState("")
    const [username,setUsername]=useState("")
    const [facultystatus,setFacultystatus]=useState(false)
    useEffect(()=>{
        async function getProfile(){
            let response=(await axios.get("/api/getResource/profile")).data
            console.log(response)
            setImage(response.profile)
            setUsername(response.username)
        }
        getProfile()
        async function getfacultyStatus(){
            let response=(await axios.get("/api/getResource/getfacultyStatus")).data
            console.log(response)
            if(response.faculty){
                setFacultystatus(true)

            }
        }
        getfacultyStatus()
    },[])
    function upgradeHandler(){
        window.location.href="/upgrade/facultyupgrade"
    }
    function uploadHandler(){
        window.location.href="/upload/courseupload"
    }
    return(
        <div className="w-screen h-screen flex flex-col items-center justify-start ">
            <Navbar/>
            <div className="bg-green-800 rounded-lg w-52 h-52 flex flex-col items-center justify-evenly text-white ">
                <img src={image} className="rounded-full mt-3" width={30}  height={30} ></img>
                <p className="font-bold mt-3">{username}</p>
                {facultystatus? <button className="bg-white text-black font-bold rounded-lg" onClick={uploadHandler}>upload</button> : <button onClick={upgradeHandler} className="bg-white text-black font-bold rounded-lg mt-3">upgrade</button> }
            </div>
        </div>
    )
}