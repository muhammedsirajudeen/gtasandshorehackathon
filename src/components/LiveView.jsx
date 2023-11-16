import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { GlobalAccelerator } from "aws-sdk"
import { ClipLoader } from "react-spinners"
import { useSession } from "next-auth/react"
export default function LiveView({setOpen,id}){
    const [live,setLive]=useState("")
    const connected=useRef(false)
    const globalpeerConnection=useRef("")
    
    const [loading,setLoading]=useState(true)
    const {data:session,status}=useSession()
    const ws=useRef()

    const [videoelement,setVideoelement]=useState(null)
    const [mediastream,setMediastream]=useState(null)
    useEffect(()=>{
      if(status==="authenticated"){
        if(!connected.current){
          //here we cant use the common system that we use thats why we used seperate websocket logic here
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
              const configuration = {
                iceServers: [
                  { urls: 'stun:stun.l.google.com:19302' },
                  { urls: 'stun:stun1.l.google.com:19302' },
                  { urls: 'stun:stun2.l.google.com:19302' },
                  { urls: 'stun:stun3.l.google.com:19302' },
                  { urls: 'stun:stun.stunprotocol.org:3478' },
                  { urls: 'stun:stun.voipbuster.com:3478' },
                  { urls: 'stun:stun.ideasip.com:3478' },
                  // Add more STUN servers as needed
                ]
              };                const peerConnection = new RTCPeerConnection(configuration);
              let remotevideo=document.querySelector("#remotevideo")
              peerConnection.ontrack = (event) => {
                  console.log(event.streams[0])
                  if (event.streams.length > 0) {
                          // mediastream.current=event.streams[0]
                          setMediastream(event.streams[0])
                          // console.log(remotevideo)
                          // console.log("the video element is",remotevideo)
                          // remotevideo.srcObject = event.streams[0];
                          // remotevideo.play();
                          // console.log("started playing")

        
                 

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
              setTimeout(()=>{
                alert("socket opened")
                console.log("sending offer")
                ws.current.send(JSON.stringify({to:response.live.tutorname,event:"offer",offer:peerConnection.localDescription}))

              },[5000])

              //sending answer back
         

              
          }

          getLivebyid()
  
      }
      connected.current=true
      }

    },[])
    useEffect(()=>{
      if(mediastream && videoelement ){

        console.log("use effect running")
        console.log(videoelement)
        videoelement.srcObject=mediastream
        videoelement.play()
      }
    },[mediastream,videoelement])
    function playHandler(){
      let videoelement=document.querySelector("#remotevideo")
      setVideoelement(videoelement)
    }
    return(
      <>
    {loading? <div className="w-screen h-screen items-center justify-center"><ClipLoader loading={loading}></ClipLoader></div> 
    
  :
  
  <div className=" border fixed w-screen h-screen flex items-center justify-center top-0 bottom-0">
  <div className="w-96 h-96 bg-white border border-black flex flex-col items-center justify-start ">
      <button onClick={()=>setOpen(false)} className="font-bold" >x</button>
      <video muted id="remotevideo"></video>
      <div className="font-bold" >sessionname</div>
      <div className="text-xs" > {live.sessionname} </div>
      <div className="font-bold" >sessiondescription</div>
      <div className="text-xs" > {live.sessiondescription} </div>
      <button onClick={playHandler} className=" border border-black bg-black text-white font-bold">start playing</button>
  </div>
</div>
  }


      </>
    )
}