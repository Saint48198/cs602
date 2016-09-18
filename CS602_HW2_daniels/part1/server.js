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
                let msg = '"Invalid request"';
                
                if (command) {
                    result = doCommand(command);;
                    logCommand(command);

                    if (result === false) {
                        if (command === 'bye') {
                            msg += '|exit';
                        }

                        socket.write(msg);
                    } else {
                        socket.write(JSON.stringify(result));
                    }
                }
            });
        }
    );

    server.listen(3000, () => {
        console.log('Listening for connections');
    });
    /**
     * Function for excutting selected function
     * Arguments: command name <string>
     * Returns: return value from function or false
     **/
    function doCommand (command) {
        let dataStringArray = command.split(' ');
        let dataStringArrayLen = dataStringArray.length;
        let func = dataStringArrayLen ? employees[dataStringArray[0]] : null; // get function if available
        let employeeDataCallback;

        if (dataStringArrayLen >= 2 && typeof func === 'function') {
            // determine if first argument is a number and if so convert the argument from string to number
            if (!isNaN(parseFloat(dataStringArray[1])) && isFinite(dataStringArray[1])) {
                dataStringArray[1] = parseInt(dataStringArray[1]);
            }
            
            // return the object value if not undefined or return arguments
            return func.apply(this, dataStringArray.slice(1)) || dataStringArray.slice(1).join(',');
        }

        return false;
    }
    /**
     * Function for logging recieved command function and values
     * Arguments: command string (function name and arguments)
     **/
    function logCommand (command) {
        let msg = '...Received ' + command;
        console.log(msg.blue);
    }

})();
