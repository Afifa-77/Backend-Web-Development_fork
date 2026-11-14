const { Server } = require('socket.io');

function initSocket(httpServer) {
    // TODO 1: Create Socket.IO server
    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    // TODO 2: Listen for new client connections
    io.on('connection', (socket) => {
        console.log(`[+] connected: ${socket.id}`);

        // TODO 3: Join a room
        socket.on('joinRoom', (data) => {
            socket.join(data.room);
        });

        // TODO 4: Leave a room
        socket.on('leaveRoom', (data) => {
            socket.leave(data.room);
        });

        // TODO 5: Receive and broadcast new comments
        socket.on('newComment', (data) => {
            io.to(data.room).emit('commentAdded', data);
        });

        // TODO 6: Handle client disconnection
        socket.on('disconnect', (reason) => {
            console.log(`[-] disconnected: ${socket.id} (${reason})`);
        });
    });

    // TODO 7: Return Socket.IO instance
    return io;
}

module.exports = { initSocket };