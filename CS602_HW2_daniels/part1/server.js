(function () {
    'use strict';

    const colors = require('colors');
    const net = require('net');
    const employees = require('./employeeModule');

    const clients = [];

    const server =  net.createServer(
        (socket) => {

            clients.push(socket);

            console.log('Client connection...'.red);

            socket.on('close', () => {
                console.log('Client disconnected...'.red);

                if (clients.length) {
                    clients.splice(clients.indexOf(socket), 1);
                }
            });

            socket.on('data', (data) => {
                let command = data.toString();
                let result;

                if (command) {
                    result = doCommand(command);;
                    logCommand(command);

                    if (result !== false) {
                        socket.write(JSON.stringify(result));
                    }
                }
            });
        }
    );

    server.listen(3000, () => {
        console.log('Listening for connections');
    });

    function doCommand (command) {
        let dataStringArray = command.split(' ');
        let dataStringArrayLen = dataStringArray.length;
        let func = dataStringArrayLen ? employees[dataStringArray[0]] : null;
        let employeeDataCallback;

        if (dataStringArrayLen >= 2 && typeof func === 'function') {
            if (!isNaN(parseFloat(dataStringArray[1])) && isFinite(dataStringArray[1])) {
                dataStringArray[1] = parseInt(dataStringArray[1]);
            }

            return func.apply(this, dataStringArray.slice(1));
        }

        return false;
    }

    function logCommand (command) {
        let msg = '...Received: ' + command;
        console.log(msg.blue);
    }

})();
