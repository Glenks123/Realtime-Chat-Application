const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bot = 'BOT';

// Set static folders
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    //socket.emit allows us to send a message to be received by socket.on and log it onto the console
    console.log('New WS connection...');

    socket.on('joinChatRoom', ({ username, room }) => {

        //User is an OBJECT
        const user = userJoin(socket.id, username, room);
        //console.log(user)

        socket.join(user.room);

        // Welcomes the user
        socket.emit('message', formatMessage(bot, `Welcome to the ${user.room} room!`));

        // Broadcast to everyone except the user that the user has connected.
        //to(user.room) broadcasts the message to the specific room
        socket.broadcast.to(user.room).emit('message',  formatMessage(bot, `${user.username} has joined the chat.`));

        // Sends the specific room and all the users in that room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // listening for chatMessage from main.js
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        // emits the message to everyone.
        io.to(user.room).emit('message',  formatMessage(user.username, msg));
    });

    // Runs when a client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        // if user exists
        if (user){
            //io.emit() sends to the entire server
            io.to(user.room).emit('message',  formatMessage(bot, `${user.username} has left the chat`));
            // Send user and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}...`);
});