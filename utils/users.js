const users = [];
const createdRooms = [];
const visitors = [];

function createGameRoom(player1, player1Email, player2, player2Email, gameId, roomId){
  const newRoom = { player1, player1Email, player2, player2Email, gameId, roomId };

  createdRooms.push(newRoom);
  console.log(newRoom)
}

function getCurrentRoom(roomId) {  
  return createdRooms.find(currRoom => currRoom.roomId === roomId);
}

function visitorJoin(id, userName, email) {
  console.log('visitor join')
  const visitor = { id, userName, email};
  visitors.push(visitor);  
}
function getCurrentVisitor(email) {
  console.log('email',email)
  console.log('visitors',visitors)
  return visitors.find(visitor => visitor.email === email);
}


function userJoin(id, userName, role, email, roomId, gameId, advanceMode) {
  const user = { id, userName, role, email, roomId, gameId, advanceMode };

  users.push(user);

  return user;
}


function getCurrentUser(id) {
  return users.find(user => user.id === id);
}


function userLeave(id) {  
  var indexUser = visitors.findIndex(user => user.id === id);
  if (indexUser !== -1) {
    visitors.splice(indexUser, 1)[0];
  }
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}


function getRoomUsers(roomId) {
  return users.filter(user => user.roomId === roomId);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  createGameRoom,
  getCurrentRoom,
  visitorJoin,
  getCurrentVisitor
};
