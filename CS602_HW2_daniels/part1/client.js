'use strict';

const net = require('net');

const client = net.connect({ port: 3000 }, () => {
    console.log('Connect to server');
    let msg = 'Hello from client ' + Math.floor(1000 * Math.random());

    console.log('Sending: ' + msg);
    client.write(msg);
});

client.on('end', () => {
    console.log('Client disconnected...');
}); 

client.on('data', (data) => {
    console.log('Recieved: ', data.toString());
    client.end();
});