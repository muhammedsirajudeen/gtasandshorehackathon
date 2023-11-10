import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PulseLoader } from "react-spinners";
export default function LandingPage() {
    const [loading,setLoading]=useState(true)
    const {data:session,status}=useSession()

    useEffect(()=>{
      console.log(session)
      if(status==="authenticated"){
        
        window.location.href="/home"
      }else if(status==="unauthenticated"){
        setLoading(false)
      }
    },[session])    
    return (
      loading? <div className="w-screen h-screen fixed flex justify-center items-center"> <PulseLoader loading={loading} /> </div> :
      <div className="w-screen h-screen overflow-x-hidden bg-customcolor">
      
        <div className="flex w-screen items-center justify-evenly text-white font-extrabold mt-5">
          <p className="text-4xl xs:text-xl ">PROTOTYPE</p>
          <a href="/signup"className="text-linkcolor hover:text-white m-3 "  >
            Register
          </a>
          <a href="/api/auth/signin" className="text-linkcolor hover:text-white m-3 " >
            Login
          </a>

        </div>
      </div>
    );
  }
  