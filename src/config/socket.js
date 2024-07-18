const { Server } = require('socket.io');
const { CLIENT_ADDRESS } = require('./constants');

let io

exports.socketConfig = (server) => {
    io = new Server(server, {
        cors: {
            origin: [CLIENT_ADDRESS],
            methods: ["GET", "POST"]
        }
    })

    io.on('connection', (socket) => {
        socket.on('online', (userId) => {
            socket.join(userId)
        })

        socket.on('offline', (userId) => {
            socket.leave(userId)
        })
    })
}

exports.getSocket = () => io