const express = require('express');
const app = module.exports = express();
const router = express.Router();

app.use('/chat', router);
router.get('/', (req, res, next) => {
  next();
});

router.get('/', (req, res) => {
  res.send(resultResponse(0, null, "CHAT ROOT"));
})

const io = require('socket.io')(server);
io.on('connection', socket => {

  console.log(socket.id, "CONNECTED");

  // set client nickname
  socket.on('set_nick', (name) => {
    socket.nickname = name;
  })

  socket.on('client_message', (data) => {
    io.to(data.room).emit('server_response', data);
  });

  /* room subscriptions
   *  announced connection and refressh list
   */
  socket.on('join_room', (room) => {
    socket.join(room);
    io.to(room).emit('server_response', { id : "server", user : "server", message : `${socket.nickname} joined ${room}`, time : new Date() });
    refreshUsers(room);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
  });

  // announce disconnect and refresh list
  socket.on('disconnecting', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      io.to(room).emit('server_response', { id : "server", user : "server", message : `${socket.nickname} left ${room}`, time : new Date() });
      refreshUsers(room, socket.id);
    })
  })

  socket.on('disconnect', () => console.log(socket.id, "DISCONNECTED"));

  /* refresh user list in a specifie room
   *  if id is provided, exclude it from the list
   */
  const refreshUsers = (room, id) => {
    // get list of client nicknames and return it to the user
    var users = [];
    var clients = Object.keys(io.sockets.adapter.rooms[room]?.sockets);
    for(var i = 0, length = clients.length; i < length; i++) {
      var nickname = io.sockets.connected[clients[i]].nickname;
      if(id !== clients[i]) users.push(nickname)
    }

    io.sockets.in(room).emit('users', users);
  };
})


