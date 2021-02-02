// moment helps make data, time easier
const moment = require('moment');

let formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

// this allows us to require it in the server.js
module.exports = formatMessage;