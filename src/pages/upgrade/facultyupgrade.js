import Navbar from "@/components/Navbar";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
export default function Facultyupgrade(){
    const [bio,setBio]=useState("")
    const [cover,setCover]=useState("")
    const [links,setLinks]=useState("")
    const router=useRouter()
    async function facultyHandler(){
        let response=(await axios.post("/api/faculty/addfaculty",{
            bio:bio,
            cover:cover,
            socialLinks:links
            
        })).data
        console.log(response)
        if(response.message!=="success"){
            alert(response.message)
        }else{
            alert("success")
            setBio("")
            setCover("")
            setLinks("")
            router.push("/profileinsights")
            
        }
    }
    return(
        <div className="w-screen h-screen flex flex-col items-center justify-start">
            <Navbar/>
            <div className= "flex flex-col w-96 h-72 items-center justify-evenly  rounded-lg border mt-20" >
                <input className="border h-20" type="text" placeholder="write about yourself"  value={bio} onChange={(e)=>setBio(e.target.value)} ></input>
                <input  className="border" type="text" placeholder="why do you wanna work with us" value={cover} onChange={(e)=>setCover(e.target.value)} ></input>
                <input className="border" type="text" placeholder="social links" value={links} onChange={(e)=>setLinks(e.target.value)}  ></input>
                <button className="bg-blue-800 text-white rounded-md " onClick={facultyHandler} >  become a faculty</button>
                
            </div>
        </div>
    )
}