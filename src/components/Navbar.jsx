import axios from "axios"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"
export default function Navbar(){
    const [username,setUsername]=useState("")
    const [profile,setProfile]=useState("")
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        async function getProfile(){
            let response=(await axios.get("/api/getResource/profile")).data
            console.log(response)
            setUsername(response.username)

            setProfile(response.profile)
            setLoading(false)
        }
        getProfile()
    },[])
    async function signoutHandler(){
            await signOut()
            localStorage.clear()
    }
    return(
        <div className="flex w-screen items-center justify-evenly m-3">
            <div className=" font-bold">OSLP</div>
            <a href="/course/course" className="font-bold" >COURSES</a> 
            <a href="/profileinsights" className="font-bold" >PROFILE</a> 
            <a href="/chat" className="font-bold" >CHAT</a> 


            <div className="flex justify-center items-center">
                {loading ? <PulseLoader loading={loading}/> : 
                <>
                    <img className="rounded-full"  src={profile} alt="profile" width={30} height={20}/>
                    <div className=" font-bold">{username}</div>

                </>
             }
               
            </div>
            <button onClick={signoutHandler}  className=" bg-custombgcolor text-white text-xs h-8 w-14 rounded-lg font-light">signout</button>

        </div>
    )
}