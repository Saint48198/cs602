'use strict';

const _ = require('underscore');
let data = [
    { id: 1,    firstName: 'John',     lastName: 'Smith'  },
    { id: 2,    firstName: 'Jane',     lastName: 'Smith'  },
    { id: 3,    firstName: 'John',     lastName: 'Doe'    }
];

class Employees {
    /** 
    * Function for looking up Employees by ID number.
    * Arguments: ID <integer> 
    * Returns: employee object (found) or undefined (not found)
    **/
    lookupById (id) {
        return _.findWhere(data, { id: id });
    }

    /**
     * Function for looking yp employees by last name
     * Arguments: Last Name <string>
     * Returns: array of employees (found) or empty array (not found)
     **/
    lookupByLastName (lname) {
        return _.where(data, { lastName: lname });
    }

    /**
     * Function for adding new employees 
     * Arguments: first name <string>, last name <string>
     **/
    addEmployee (fname, lname) {
        let max = _.max(data, function(employee) { return employee.id }); // get the largest existing employee ID
        let id = max.id ? max.id + 1 : 0; // create new employee ID
        data.push({ id: id, firstName: fname, lastName: lname });

        return id;
    }

    /**
     * Function for changing employee first names using thier ID
     * Arguments: ID <integer>, first name <string>
     **/
    changeEmployeeFirstName (id, fname) {
        data.some(function (employee) {
            if (employee.id === id) {
                employee.firstName = fname;
                return true;
            }
        });
    }
}

const theEmployees = new Employees();

module.exports.lookupById = theEmployees.lookupById;

module.exports.lookupByLastName = theEmployees.lookupByLastName;

module.exports.addEmployee = theEmployees.addEmployee;

module.exports.changeEmployeeFirstName = theEmployees.changeEmployeeFirstName;
