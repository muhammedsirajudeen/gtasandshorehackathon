import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socketHandler from "@/serverhelper/socket";
export default function Liveclass(){
    //creating live classes
    const connected=useRef(false)
    const [online,setOnline]=useState(false)
    const [sessionname,setSessionName]=useState("")
    const [sessiondescription,setSessiondescription]=useState("")
    const ws = useRef();
    const globalpeerConnection=useRef()
    const {data:session,status}=useSession()
    const [loading,setLoading]=useState(true)


    
    useEffect(()=>{
      if(status==="authenticated"){
        if(!connected.current){

          try {
            console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URI)
          const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URI);
          ws.current=socket
          //this function handles close and open events
          socketHandler(socket,session)
          
          socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);
            console.log(data)
            if(data.event==="serverack"){
              
              if(data.message==="success"){
                setLoading(false)
              }
            }
            else if(data.event==="offer"){
              console.log("the offer is ",data.offer)
              let offer=data.offer
              globalpeerConnection.current.setRemoteDescription(offer)
            }
          });



          connected.current = true;
          ws.current = socket;
        } catch (error) {
          alert("error occurred");
        }

            const localVideo = document.getElementById('localvideo');
        
            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
              .then((stream) => {
                console.log(stream)
                localVideo.srcObject = stream;
        
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
                };
                const peerConnection = new RTCPeerConnection(configuration);
                globalpeerConnection.current=peerConnection
                localVideo.play()
                stream.getTracks().forEach(track => globalpeerConnection.current.addTrack(track, stream));
                
                // ... (code for handling WebRTC connections)
              


                //now a user has to send a request and then we create offer and sends it back lets do that 
        

              })
              .catch((error) => {
                console.error('Error accessing media devices:', error);
              });
              connected.current=true
        }
      }


    },[status])
    function liveHandler(){
      console.log(online)
      if(!online){
        
        if(sessionname.length<3 && sessiondescription.length<3){
          alert("please enter session name and description")
          return
        }
        function createOffer() {
          globalpeerConnection.current.createOffer()
            .then(offer => globalpeerConnection.current.setLocalDescription(offer))
            .then(() => {
              let icecandidates=[]
              globalpeerConnection.current.onicecandidate = async (event) => {
                if (event.candidate) {
                  icecandidates.push(event.candidate)
                }
               
                if(icecandidates.length===6){
                  let response=(await axios.post("/api/live/storelive",{
                    tutorname:session.user.name,
                    sessionname:sessionname,
                    sessiondescription:sessiondescription,
                    offer:JSON.stringify(globalpeerConnection.current.localDescription),
                    icecandidates:JSON.stringify(icecandidates)
  
                  })).data
                  console.log(response)
                  if(response.message==="success"){
                    alert("live started succesfully")
                    setOnline(true)
                  }
                  return
                }
              };
  
              
            });
        }
        createOffer()
        console.log("offer created")


      }

      
    }

    return(
        <div className="w-screen h-screen flex flex-col items-center justify-start">
            <Navbar/>
            {online ? <div className="bg-green-600 font-bold text-white text-xs m-5 p-1">online</div> : <div className="bg-gray-600 text-white text-xs font-bold m-5 p-1 rounded-lg ">offline</div> }
            <video id="localvideo" className="w-96 " ></video>
            <input type="text" className="border mt-5 border-black" placeholder="enter session name" value={sessionname} onChange={(e)=>setSessionName(e.target.value)}  ></input>
            <input type="text" className=" mt-5 h-20 border border-black" placeholder="enter session description" value={sessiondescription} onChange={(e)=>setSessiondescription(e.target.value)} ></input>
            <button onClick={liveHandler}  className="bg-red-600 p-2 text-white font-bold rounded-lg mt-5 ">START LIVE</button>

            <div className="flex items-center border border-black w-3/4 pb-10 mt-5 justify-start flex-col">
              <p className="text-xl font-bold">
                LIVE CHAT
              </p>
            </div>
        </div>
    )
}