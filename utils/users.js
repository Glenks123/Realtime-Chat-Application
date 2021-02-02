const users = new Array();

let userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// Get current user
let getCurrentUser = id => {
    //Finds the user from the 'users array' where the user id in that object is equal to the id passed in
    return users.find(user => user.id === id);
}

// User leaves chat
let userLeave = id => {
    //Find the index of the user in the users array where the user id is equal to the id passed in 
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}

// Get users in room

let getRoomUsers = room => {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};