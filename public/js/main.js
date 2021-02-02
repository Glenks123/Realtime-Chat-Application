const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Getting username and room from the URL. EX: http://localhost:3000/chat.html?username=Glen&room=JavaScript
// Gets Glen and Javascript from the URL

const { username, room } = Qs.parse(location.search, {
    // ignores the ?, & etc.
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

// Joining chatroom
socket.emit('joinChatRoom', { username, room });

// Get room and users info
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// socket.on is used for listening for any incoming messages
socket.on('message', message => {
    // message is caught from the server.js and displayed on the web console
    //console.log(message);
    outputMessage(message);

    // Scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', event => {
    // this prevents the form from storing the value in an other file which it does by default.
    event.preventDefault();
    // the message
    const msg = event.target.elements.msg.value;
    // emiting so that it can be caught by the server and consoled there instead on the web console
    socket.emit('chatMessage', msg);

    //clears text area
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
});

let outputMessage = message =>{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Adding room names to DOM
let outputRoomName = room => {
    roomName.innerText = room;
}

// Adding users to DOM
let outputUsers = users => {
    userList.innerHTML = users.map(user => `<li>${user.username}</li>`).join('')
}