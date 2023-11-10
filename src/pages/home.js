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
      setLoading(false)
    }else if(status==="unauthenticated"){
      window.location.href="/"
    }
  },[session])
  return (
    loading? <div className="fixed w-screen h-screen flex items-center justify-center"><PulseLoader loading={loading}/></div> :
      <div className="flex w-screen h-screen flex-col items-center">
        <Navbar username={session.user.name} />
      </div>
    )

}
