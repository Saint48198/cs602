'use strict';
const colors = require('colors');
const net = require('net');
const employees = require('./employeeModule');

const clients = [];

const server =  net.createServer(
    (socket) => {
        clients.push(socket);

        console.log('Client connection...'.red);

        socket.on('end', () => {
            console.log('Client disconnected...'.red);

            if (clients.length) {
                clients.splice(clients.indexOf(socket), 1);
            }
        });

        socket.on('data', (data) => {
            console.log('...Received: ', data.toString());
        });
    }
);

server.listen(3000, () => {
    console.log('Listening for connections');
});