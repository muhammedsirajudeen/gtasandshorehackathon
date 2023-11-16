export default function socketHandler(socket,session){
    socket.addEventListener('open', (event) => {
        console.log("the session is",session.user.name)
        socket.send(JSON.stringify({ event: "clientack", message: session.user.name }));
      });
      socket.addEventListener('close', (event) => {
        alert("try refreshing the page")
        
      });
}