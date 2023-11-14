// Import necessary styles and components
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { ClipLoader } from "react-spinners";

// Chat component
export default function Chat() {
  // Refs, state, and session hook
  const connected = useRef(false);
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [currentuser, setCurrentuser] = useState("");
  const [currentchat, setcurrentChat] = useState([]);
  const ws = useRef();
  const [loading,setLoading]=useState(true)
  // Function to handle sending messages
  function chatHandler() {
    setcurrentChat((prev) => [...prev, { color: "black", chat: chat }]);
    if(localStorage.getItem(currentuser)){
      console.log(localStorage.getItem(currentuser))
      let  chatmessages= JSON.parse((localStorage.getItem(currentuser))) 

      chatmessages.push({remote:chat})
      localStorage.setItem(currentuser,JSON.stringify(chatmessages))
    }else{
      localStorage.setItem(currentuser,JSON.stringify([{remote:chat}]))
      console.log("initial chat set successfully")
    }
    ws.current.send(JSON.stringify({ event: "incomingmessage", to: currentuser, chat: chat }));
    setChat(""); // Clear the input field after sending a message
  }
  function chatHelper(data){
    //this function help in storing to localstorage
    if(localStorage.getItem(data.from)){
      console.log(localStorage.getItem(data.from))
      let  chat= JSON.parse((localStorage.getItem(data.from))) 

      chat.push(data.message)
      localStorage.setItem(data.from,JSON.stringify(chat))
    }else{
      localStorage.setItem(data.from,JSON.stringify([data.message]))
      console.log("initial chat set successfully")
    }
  }

  // useEffect to handle WebSocket connection and API call
  useEffect(() => {
    localStorage.removeItem("currentuser")
    if (status === "authenticated") {
      if (!connected.current) {
        try {
            console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URI)
          const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URI);

          socket.addEventListener('open', (event) => {
            console.log("the session is",session.user.name)
            socket.send(JSON.stringify({ event: "clientack", message: session.user.name }));
          });

          socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);
            console.log(data)
            if (data.event === "incomingmessage") {
            
              let currentuser=localStorage.getItem("currentuser")
              if(data.from===currentuser){
                chatHelper(data)
                setcurrentChat((prev) => [...prev, { color: "green", chat: data.message }]);
              }else{
                chatHelper(data)
              }
            
            }
            else if(data.event==="serverack"){
              
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
      }

      // API call to get all users
      async function getallUsers() {
        try {
          let response = (await axios.get("/api/user/getallUsers")).data;
          setUsers(response.users);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }

      getallUsers();
    }
  }, [session]);

  // Render UI
  return (
    <>
    {loading? 
    <div className="flex w-screen h-screen justify-center items-center">
      <ClipLoader loading={loading}/>

    </div>
       :
       <div className="min-h-screen flex flex-col">
       <Navbar />
 
       <div className="flex">
         {/* Users List */}
         <div className="w-1/2 bg-gray-100 p-4 chatcontainer ">
           {users.map((value) => {
            if(!(value.username===session.user.name)){
              return(
                <div key={value.id} className="flex items-center mb-3">
                <img src={value.profilepicture} alt={value.username} className="w-8 h-8 rounded-full mr-2" />
                <div>{value.username}</div>
                <button
                  className="ml-auto bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() =>{
                   setcurrentChat([])
                   setCurrentuser(value.username)
                   localStorage.setItem("currentuser",value.username)
                   let chatmessages=JSON.parse(localStorage.getItem(value.username))
                   console.log(chatmessages)
                   if(chatmessages){
                    chatmessages.forEach((chatmessage)=>{
                      console.log(chatmessage)
                      if(chatmessage.remote){
                        setcurrentChat((prev) => [...prev, { color: "black", chat: chatmessage.remote}]);

                      }else{
                        setcurrentChat((prev) => [...prev, { color: "green", chat: chatmessage }]);

                      }

                    })
                    }}
                   }
  
                >
                  Chat
                </button>
              </div>
              )
            }

})}
         </div>
 
         {/* Chat Window */}
         <div className="flex-1 bg-white p-4">
           <h1 className="text-2xl font-semibold mb-4">Chat with {currentuser}</h1>
           <div className="flex-1 overflow-y-auto h-96 overflow-y-scroll ">
             {currentchat.map((value, index) => (
               <div key={index} className={`mb-2 ${value.color}`}>{value.chat}</div>
             ))}
           </div>
           <div className="flex mt-4">
             <input
               className="flex-1 border border-gray-300 px-2 py-1 rounded-l"
               type="text"
               value={chat}
               onChange={(e) => setChat(e.target.value)}
             />
             <button
               className="bg-blue-500 text-white px-4 py-2 rounded-r"
               onClick={chatHandler}
             >
               Send
             </button>
           </div>
         </div>
       </div>
     </div>

  
  
  }

    </>

  );
}
