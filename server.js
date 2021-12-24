const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  createGameRoom,
  getCurrentRoom,
  visitorJoin,
  getCurrentVisitor
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
  socket.on("visited", (data) => {
    console.log('visited',data);
    
    visitorJoin(socket.id, data.userName, data.email); 
    
  });
  socket.on("createRoom", (data) => {
    console.log(data);
    roomId = data.gameId +'_'+ Math.floor(Math.random() * 26) + Date.now();
    createGameRoom(data.user1, data.user1Email, data.user2, data.user2Email, data.gameId, roomId); 
    socket.emit("roomCreated", roomId);

    var invitedPlayer = getCurrentVisitor(data.user2Email);
    console.log('invitedPlayer', invitedPlayer);

    io.to(invitedPlayer.id).emit("invited", {gameId:data.gameId, roomId, msg:formatMessage(data.user1, 'You are invited to play ember pong game.')});

  });

  socket.on("joinRoom", (data) => {
    console.log(data);
    const targetRoom = getCurrentRoom(data.roomid);
    console.log('targetRoom',targetRoom)
    const usersInRoom = getRoomUsers(data.roomid);
    console.log('usersInRoom',usersInRoom)
    

    if(usersInRoom.length > 0){
      console.log('full room')
      socket.emit('message', formatMessage(botName, 'full'));
    }else{
      console.log('vacancy room')
      const user = userJoin(socket.id, data.user, data.role, data.email, data.roomid, data.gameId, data.advanceMode );
      socket.join(user.roomid);
      socket.emit('message', formatMessage(botName, 'Welcome to ember gaming engine!'));

      socket.broadcast
        .to(user.roomid)
        .emit(
          'message',
          formatMessage(botName, `${user.userName} has joined the game`)
      );
    }
    

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
