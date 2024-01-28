
const { Server: SocketIoServer } = require('socket.io');
function initializeSocket(server) {
    // const io = Server(server);
    const io = new SocketIoServer(server, {
        cors: { origin: '*' }
    });
    // Listen for WebSocket connections
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('logout', function () {
            socket.disconnect(true);
            console.log('io: logout');
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });


    });

    return io;
}

module.exports = initializeSocket;