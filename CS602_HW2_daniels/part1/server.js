'use strict';

const net = require('net');

const server =  net.createServer(
    (socket) => {
        console.log('Client connection...');

        socket.on('end', () => {
            console.log('Client disconnected...');
        });

        socket.on('data', (data) => {
            console.log('Received: ', data.toString());
        });

        socket.write('Hello from the server');
    }
);

server.listen(3000, () => {
    console.log('Listening for connections');
});