'use strict';

const colors = require('colors');
const EmployeeEmitter =  require('./employeeEmitter').EmployeeEmitter;

let data = [
    { id: 1,    firstName: 'John',     lastName: 'Smith'  },
    { id: 2,    firstName: 'Jane',     lastName: 'Smith'  },
    { id: 3,    firstName: 'John',     lastName: 'Doe'    }
];

const emitter = new EmployeeEmitter(data);

// emitter listeners for events
emitter.on('lookupById', (id) => {
    let alert = 'Event lookupById raised! ' + id;
    console.log(alert.red);
});

emitter.on('lookupByLastName', (lname) => {
    let alert = 'Event lookupByLastName raised! ' + lname;
    console.log(alert.red);
});

emitter.on('addEmployee', (fname, lname) => {
    let alert = 'Event addEmployee raised! ' + fname + ',' + lname;
    console.log(alert.red);
});


console.log('Lookup by last name (Smith)'.blue);
console.log(emitter.lookupByLastName('Smith'));

console.log(' ');

console.log('Adding employee William Smith');
emitter.addEmployee('William', 'Smith');

console.log(' ');

console.log('Lookup by last name (Smith)'.blue);
console.log(emitter.lookupByLastName('Smith'));

console.log(' ');

console.log('Lookup by id (2)'.blue);
console.log(emitter.lookupById(2));