const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
  cors: {
    origin: "http://localhost:3000", // will need to change to url of deployed frontend
    methods: ["GET", "POST"]
  }
});

const rooms = [];

app.get('/', (req, res) => {
  res.send('Server is running...');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join game', (input)=>{
      console.log(`${input.nickname} joined '${input.room}'`);
      if (rooms.indexOf(input.room)!=-1){
        socket.join(input.room);
        socket.emit('enter room');
        socket.to(input.room).emit('user joined', {
          "message":`${input.nickname} has joined the game!`,
          "nickname":input.nickname,
          "id":socket.id
        });
        socket.nickname = input.nickname;
        socket.myRoom = input.room;
      } else {
        socket.emit('error', 'This room has not been created yet.')
      }
    });

    socket.on('new room', (input)=>{
      console.log(`${input.nickname} created room '${input.newRoom}'`);
      if (rooms.indexOf(input.room)==-1){
        socket.join(input.newRoom);
        rooms.push(input.newRoom);
        socket.nickname = input.nickname;
        socket.myRoom = input.newRoom;
        socket.emit('init host')
      } else {
        socket.emit('error', 'This room already exists, try a different room name')
      }
    })

    socket.on('message from client', ({message, nickname, room})=>{
      socket.to(room).emit('chat message', {message,nickname});
    })

    socket.on('start game', (state) => {
      socket.to(state.room).emit('game state change', state)
    })

    //tell all that a user disconnected
    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.to(socket.myRoom).emit('user left', {
        "message":`${socket.nickname} has left the game.`,
        "id":socket.id
      })
    });
  });


http.listen(5000, () => {
  console.log('listening on *:5000');
});
