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

    socket.on('game entrance', (msg)=>{
      console.log('from client: ', msg);
    });

    socket.on('new code', (code)=>{
      console.log(code);
    })

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });


http.listen(5000, () => {
  console.log('listening on *:5000');
});

