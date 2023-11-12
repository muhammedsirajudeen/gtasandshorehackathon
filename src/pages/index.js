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
      <div className="w-screen h-screen flex flex-col overflow-x-hidden bg-customcolor">
      
        <div className="flex w-screen items-center justify-evenly text-white font-extrabold mt-5">
          <p className="text-4xl xs:text-xl ">OSLP</p>
          <a href="/signup"className="text-linkcolor hover:text-white m-3 "  >
            Register
          </a>
          <a href="/api/auth/signin" className="text-linkcolor hover:text-white m-3 " >
            Login
          </a>
        
        </div>
        <p className="w-screen font-bold text-4xl mt-20 text-white ml-5">OPEN SOURCE LERNING PLATFORM</p>
        <p className="text-xs font-extrabold text-white ml-5  ">make your dreams come true with education freely available on our platform</p>
      </div>
    );
  }
  