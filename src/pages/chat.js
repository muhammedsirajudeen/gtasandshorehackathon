// Import necessary styles and components
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import axios from "axios";

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

  // Function to handle sending messages
  function chatHandler() {
    setcurrentChat((prev) => [...prev, { color: "black", chat: chat }]);
    ws.current.send(JSON.stringify({ event: "incomingmessage", to: currentuser, chat: chat }));
    setChat(""); // Clear the input field after sending a message
  }

  // useEffect to handle WebSocket connection and API call
  useEffect(() => {
    if (status === "authenticated") {
      if (!connected.current) {
        try {
            console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URI)
          const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URI);

          socket.addEventListener('open', (event) => {
            console.log('WebSocket connection opened:', event);
            socket.send(JSON.stringify({ event: "clientack", message: session.user.name }));
          });

          socket.addEventListener('message', (event) => {
            console.log(event);
            let data = JSON.parse(event.data);

            if (data.event === "incomingmessage") {
              setcurrentChat((prev) => [...prev, { color: "green", chat: data.message }]);
            }
          });

          socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex">
        {/* Users List */}
        <div className="w-1/2 bg-gray-100 p-4 chatcontainer ">
          {users.map((value) => (
            <div key={value.id} className="flex items-center mb-3">
              <img src={value.profilepicture} alt={value.username} className="w-8 h-8 rounded-full mr-2" />
              <div>{value.username}</div>
              <button
                className="ml-auto bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => setCurrentuser(value.username)}
              >
                Chat
              </button>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white p-4">
          <h1 className="text-2xl font-semibold mb-4">Chat with {currentuser}</h1>
          <div className="flex-1 overflow-y-auto">
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
  );
}
