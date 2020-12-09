const jwt = require('jsonwebtoken')

const createMessage = (msg, err) => ({ msg, err });

// function createMessage(msg, err) {
//     return {
//         msg,
//         err
//     }
// }

const signToken = userID => {
    return jwt.sign({
        iss: "keyboard cat",
        sub: userID
    }, "keyboard cat", { expiresIn: "1hr" });
}

module.exports = {
    createMessage,
    signToken
}