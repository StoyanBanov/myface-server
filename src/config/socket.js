const { Server } = require('socket.io');

let io

exports.socketConfig = (server) => {
    io = new Server(server, {
        cors: {
            origin: [process.env.CLIENT_ADDRESS],
            methods: ["GET", "POST"]
        }
    })

    io.on('connection', (socket) => {
        socket.on('online', (userId) => {
            if (!socket.rooms.has(userId))
                socket.join(userId)
        })

        socket.on('offline', (userId) => {
            socket.leave(userId)
        })
    })
}

exports.getSocket = () => io