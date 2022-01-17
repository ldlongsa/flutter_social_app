const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./usersGroupRealtime");
const socketio = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// Cors
app.use(cors);

// format message
const moment = require('moment');
const botName = 'Nhom12';

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

// open socket 
io.on('connection', function(socket){
    socket.on("joinRoom", ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome!'));
        socket.broadcast
        .to(user.room)
        .emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`)
        )

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

             // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    })
});

const PORT = 4000;
server.listen(PORT, "0.0.0.0", () => console.log(`Chat Server running on port ${PORT}`));