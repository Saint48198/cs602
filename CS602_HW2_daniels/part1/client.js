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
        let input = line.trim();

        if (input.toLowerCase() === 'bye') {
            client.end(); // end client instance
        } else {
            readCommand(client);
            client.write(input);
        }
    });
};

const client = net.connect({ port: 3000 }, () => {
    console.log('Connect to server');
    readCommand(client);
});

client.on('close', () => {
    console.log('Client disconnected...');
    rl.close(); // end readline instance
    return;
}); 

client.on('data', (data) => {
    console.log('...Recieved: ', data.toString());
});