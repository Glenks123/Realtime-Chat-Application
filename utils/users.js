const users = new Array();

let userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
}


let getCurrentUser = id => {
    return users.find(user => user.id === id);
}


let userLeave = id => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}

let getRoomUsers = room => {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
