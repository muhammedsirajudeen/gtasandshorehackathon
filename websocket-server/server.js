const WebSocket = require('ws');

// Create a WebSocket server on port 3000
const wss = new WebSocket.Server({ port: 5000 });
// const redis = require('redis');

// const publisher = redis.createClient({
//   host: 'localhost',
//   port: 6379,
//   // Other options...
// });

// const subscriber = redis.createClient({
//   host: 'localhost',
//   port: 6379,
//   // Other options...
// });

// we use this code to publish messages
const websocket=[]
let username
// WebSocket connection event
wss.on('connection', (ws) => {
  console.log('Client connected');

  // WebSocket message event
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    let data=JSON.parse(message)
    if(data.event==="clientack"){

        console.log(data.message)
        username=data.message
        let jsondata={}
        jsondata.username=data.message
        jsondata.ws=ws
        websocket.push(jsondata)

        // subscriber.subscribe(data.message);
    }
    else if(data.event==="incomingmessage"){
      console.log(data)
      websocket.forEach((value)=>{
        if(value.username===data.to){
          console.log("found")
          value.ws.send(JSON.stringify({event:"incomingmessage",message:data.chat,from:username}))
        }else{
          console.log("not found")
        }
      })
    }

    // Send a response back to the client
  
  });

  // WebSocket close event
  ws.on('close', () => {
    console.log('Client disconnected');
    // subscriber.unsubscribe()
    // publisher.unsubscribe()
  });
});

console.log('WebSocket server listening on port 5000');
