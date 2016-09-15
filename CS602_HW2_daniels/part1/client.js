'use strict';
const colors = require('colors');
const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const readCommand = (client) => {
    rl.question('Enter Command: ', (line) => {
        if (line === 'bye') {
            client.end();
        } else {
            readCommand(client);
        }
    });
};

const client = net.connect({ port: 3000 }, () => {
    console.log('Connect to server');
    readCommand(client);
});

client.on('end', () => {
    console.log('Client disconnected...');
}); 

client.on('data', (data) => {
    console.log('...Recieved: ', data.toString());
    client.end();
});