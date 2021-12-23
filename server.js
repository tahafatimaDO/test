const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Game Engine Bot';

// Run when client connects
io.on('connection', socket => {
  console.log("Made socket connection", socket.id);
  socket.on("createRoom", (data) => {
    console.log(data);
    roomId = data.gameId +'_'+ Math.floor(Math.random() * 26) + Date.now();
    io.sockets.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", (data) => {
    console.log(data);
    const user = userJoin(socket.id, data.user, data.email, data.roomid, data.gameId, data.advanceMode );

    socket.join(user.roomid);
    socket.emit('message', formatMessage(botName, 'Welcome to ember gaming engine!'));

    socket.broadcast
      .to(user.roomid)
      .emit(
        'message',
        formatMessage(botName, `${user.userName} has joined the game`)
    );

  });


  socket.on('joinRoom1', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    
    socket.emit('message', formatMessage(botName, 'Welcome to ember gaming engine!'));

    
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the game`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the game`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
