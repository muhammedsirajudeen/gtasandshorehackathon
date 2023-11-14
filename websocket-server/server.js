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
const websockets = [];

// WebSocket connection event
wss.on('connection', (ws) => {
  console.log('Client connected');
  // WebSocket message event
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    let data = JSON.parse(message);

    if (data.event === 'clientack') {
      console.log(data.message);
      
      ws.uniqueusername=data.message

      // Store WebSocket connection
      websockets.push({ username: data.message, ws });
      ws.send(JSON.stringify({event:"serverack",message:"success"}))

      // subscriber.subscribe(data.message);
    }else if(data.event==="offer"){
      console.log(data)
      websockets.forEach((value) => {
        if (value.username === data.to) {
          console.log("found")
          value.ws.send(JSON.stringify({ event: 'offer', offer: data.offer }));
        } else {
        }
      });
    }
     else if (data.event === 'incomingmessage') {
      console.log(data)
      websockets.forEach((value) => {
        if (value.username === data.to) {
          console.log("found")
          value.ws.send(JSON.stringify({ event: 'incomingmessage', message: data.chat, from: ws.uniqueusername }));
        } else {
        }
      });
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
