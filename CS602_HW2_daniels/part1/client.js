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
            
            client.write(input);

            if (input.toLowerCase() === 'bye') {
                client.end(); // end client instance
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
        let dataArray = data.toString().split('|');
        let msg = '...Recieved \n' + dataArray[0]; // first part of data is what needs to be printed
        console.log(msg.blue);

        // don't show comand prompt on exit
        if (dataArray[1] !== 'exit') {
            readCommand(client);
        } 
    });
})();
