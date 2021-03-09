const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('You are on the server!');
});



io.on('connection', (socket) => {
    console.log('a user connected');

    //broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the game');

    socket.on('join game', (roomName)=>{
      console.log('joined room: ', roomName);
      socket.join(roomName);
    });

    socket.on('new game', (roomName)=>{
      console.log('created room: ', roomName);
      socket.join(roomName);
    })

    //tell all that a user disconnected
    socket.on('disconnect', () => {
      io.emit('message', 'A user has left the game');
      console.log('user disconnected');
    });
  });


http.listen(5000, () => {
  console.log('listening on *:5000');
});
 
