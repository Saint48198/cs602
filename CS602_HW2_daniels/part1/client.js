(function () {
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
        rl.close(() => {
            process.exit(0);
        }); // end readline instance
    }); 

    client.on('data', (data) => {
        let msg = '...Recieved: \n' + data.toString();
        console.log(msg.blue);
        readCommand(client);
    });
})();
