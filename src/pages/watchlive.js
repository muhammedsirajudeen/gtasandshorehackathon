import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import LiveView from "@/components/LiveView";
export default function Watchlive(){
    const [loading,setLoading]=useState(true)
    const [livearray,setLivearray]=useState([])
    const [open,setOpen]=useState(false)
    const [id,setId]=useState("")
    
    useEffect(()=>{
        async function getcurrentLive(){
            let response=(await axios.get("/api/live/getlive")).data
            console.log(response)
            if(response.message==="success"){
                setLoading(false)
                setLivearray(response.livearray)
            }
        }
        getcurrentLive()
    },[])
    function watchliveHandler(e){
        setOpen(true)
        setId(e.target.id)

    }
    return(
        <>
        {loading? <div className="w-screen h-screen flex items-center justify-center"> <PulseLoader loading={loading}/> </div>  :  
        
        <div className={`w-screen h-screen flex  flex-col items-center justify-start ${open? "blur" : ""} `}>
            <Navbar/>
            {livearray.map((value)=>{
                return(
                    <div className=" border border-black mt-5 h-10 flex w-full justify-evenly items-center" key={value._id} >
                        <div className="flex-1 font-bold "  > {value.tutorname} </div>
                        <div className="flex-1 font-bold"  > {value.sessionname}</div>
                        <button className=" bg-black max-w-10 h-8 text-white mr-5 p-2 font-bold text-xs" id={value._id} onClick={watchliveHandler}   >watchlive</button>


                    </div>
                )
            })}
        
        </div>
        
        }
        {open ? <LiveView setOpen={setOpen} id={id} /> :<div></div> }


        </>
    )
}