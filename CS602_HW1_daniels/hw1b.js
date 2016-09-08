'use strict';

const colors = require('colors');
const EmployeeEmitter =  require('./employeeEmitter').EmployeeEmitter;

let data = [
    { id: 1,    firstName: 'John',     lastName: 'Smith'  },
    { id: 2,    firstName: 'Jane',     lastName: 'Smith'  },
    { id: 3,    firstName: 'John',     lastName: 'Doe'    }
];

const emitter = new EmployeeEmitter(data);

emitter.on('lookupById', (args) => {
    let alert = 'Event lookupById raised! ' + args;
    console.log(alert.red);
});

console.log('Lookup by last name (Smith)'.blue);
emitter.lookupById(2);