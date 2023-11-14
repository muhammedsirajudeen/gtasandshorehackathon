import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { GlobalAccelerator } from "aws-sdk"
import { ClipLoader } from "react-spinners"
export default function LiveView({setOpen,id}){
    const [live,setLive]=useState("")
    const connected=useRef(false)
    const globalpeerConnection=useRef("")
    const [loading,setLoading]=useState(true)
    const ws=useRef()
    useEffect(()=>{
        if(!connected.current){

            try {
                console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URI)
              const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URI);
              ws.current=socket
              socket.addEventListener('open', (event) => {
                console.log("socket opened")
                setLoading(false)
              });
    
              socket.addEventListener('message', (event) => {
                let data = JSON.parse(event.data);
                console.log(data)
                if(data.event==="serverack"){
                  
                  if(data.message==="success"){
                    setLoading(false)
                  }
                }
              });
    
              socket.addEventListener('close', (event) => {
                alert("try refreshing the page")
                
              });
    
              connected.current = true;
              ws.current = socket;
            } catch (error) {
              alert("error occurred");
            }








            async function getLivebyid(){
                let response=(await axios.post("/api/live/getlivebyid",{id:id})).data
                console.log(response)
                setLive(response.live)
                const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
                const peerConnection = new RTCPeerConnection(configuration);
                let remotevideo=document.querySelector("#remotevideo")
                peerConnection.ontrack = (event) => {
                    console.log(event.streams[0])
                    if (event.streams.length > 0) {
                        
                        remotevideo.srcObject = event.streams[0];
                        remotevideo.play();
                        console.log("started playing")
                      }
                  };
                  

                globalpeerConnection.current=peerConnection
                
                let offer=JSON.parse(response.live.offer)

                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);

                let icecandidates=JSON.parse(response.live.icecandidates[0])
                icecandidates.forEach((candidate)=>{
                     peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                })
                
                ws.current.send(JSON.stringify({to:response.live.tutorname,event:"offer",offer:peerConnection.localDescription}))

                //sending answer back
           

                
            }

            getLivebyid()
    
        }
        connected.current=true
    },[])
    return(
      <>
    {loading? <div className="w-screen h-screen items-center justify-center"><ClipLoader loading={loading}></ClipLoader></div> 
    
  :
  
  <div className=" border fixed w-screen h-screen flex items-center justify-center top-0 bottom-0">
  <div className="w-96 h-96 bg-white border border-black flex flex-col items-center justify-start ">
      <button onClick={()=>setOpen(false)} className="font-bold" >x</button>
      <video id="remotevideo"></video>
      <div className="font-bold" >sessionname</div>
      <div className="text-xs" > {live.sessionname} </div>
      <div className="font-bold" >sessiondescription</div>
      <div className="text-xs" > {live.sessiondescription} </div>

  </div>
</div>
  }


      </>
    )
}