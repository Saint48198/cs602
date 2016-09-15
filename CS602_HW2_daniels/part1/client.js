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
        if (line.trim().toLowerCase() === 'bye') {
            rl.close(); // end readline instance
            client.end(); // end client instance
        } else {
            readCommand(client);
        }
    });
};

const client = net.connect({ port: 3000 }, () => {
    console.log('Connect to server');
    readCommand(client);
});

client.on('close', () => {
    console.log('Client disconnected...');
    return;
}); 

client.on('data', (data) => {
    console.log('...Recieved: ', data.toString());
});