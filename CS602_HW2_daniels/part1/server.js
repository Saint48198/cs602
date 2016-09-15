'use strict';
const colors = require('colors');
const net = require('net');
const employees = require('./employeeModule');

const server =  net.createServer(
    (socket) => {
        console.log('Client connection...'.red);

        socket.on('end', () => {
            console.log('Client disconnected...'.red);
        });

        socket.on('data', (data) => {
            console.log('...Received: ', data.toString());
        });

        socket.write('Hello from the server');
    }
);

server.listen(3000, () => {
    console.log('Listening for connections');
});