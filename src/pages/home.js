import axios from "axios"
import { useEffect, useState } from "react"
import {useSession } from "next-auth/react"
import Navbar from "@/components/Navbar"
import {PulseLoader } from "react-spinners"
export default  function Home() {
  const [loading,setLoading]=useState(true)
  const {data:session,status}=useSession()
  useEffect(()=>{
    if(status==="authenticated"){
      console.log(session)
      
      setLoading(false)

    }else if(status==="unauthenticated"){
      window.location.href="/"
    }
  },[session])
  return (
    loading? <div className="fixed w-screen h-screen flex items-center justify-center "><PulseLoader loading={loading}/></div> :
      <div className="flex w-screen h-screen flex-col items-center">
        <Navbar/>
        <div className="w-full flex justify-evenly flex-wrap items-center mt-10">
          <div className="bg-green-900 w-52 h-52 rounded-lg flex flex-col items-center justify-center text-white font-extrabold">
            <a href="/course/course">Explore Course</a>
            <p className="text-xs m-3">ensure a great future with our courses</p>
          </div>
          <div className="bg-green-600 w-52 h-52 rounded-lg flex flex-col items-center justify-center text-white font-extrabold " >
            <a href="/profileinsights">Profile Insights</a>
            <p className="text-xs m-3">get insights about your current courses</p>
          </div>
          <div className="bg-green-500 w-52 h-52 rounded-lg flex flex-col items-center justify-center text-white font-extrabold " >
            <a href="/chat">chat</a>
            <p className="text-xs m-3">chat with your fellow learners</p>
          </div>
          <div className="bg-green-600 w-52 h-52 rounded-lg flex flex-col items-center justify-center text-white font-extrabold " >
            <a href="/liveclass">create live</a>
            <p className="text-xs m-3">create live and interact with fellow learners</p>
          </div>
          <div className="bg-green-900 w-52 h-52 rounded-lg flex flex-col items-center justify-center text-white font-extrabold " >
            <a href="/watchlive">watch live</a>
            <p className="text-xs m-3">watch live tutorials hosted by mentors</p>
          </div>
          


        </div>
      </div>
    )

}
