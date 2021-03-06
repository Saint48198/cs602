const colors = require('colors');
const employees = require('./employeeModule');

console.log('Lookup by last name (Smith)'.blue);
console.log(employees.lookupByLastName("Smith"));

console.log(' ');

console.log('Adding employee William Smith'.blue);
employees.addEmployee('William', 'Smith');

console.log(' ');

console.log('Lookup by id (2)'.blue);
console.log(employees.lookupById(2));

console.log(' ');

console.log('Changing first name...'.blue);
employees.changeEmployeeFirstName(2, 'Mary');

console.log(' ');

console.log('Lookup by id (2)'.blue);
console.log(employees.lookupById(2));

console.log(' ');

console.log('Lookup by last name (Smith)'.blue);
console.log(employees.lookupByLastName("Smith"));