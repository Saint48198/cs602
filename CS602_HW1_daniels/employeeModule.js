'use strict';

const _ = require('underscore');
let data = [
    { id: 1,    firstName: 'John',     lastName: 'Smith'  },
    { id: 2,    firstName: 'Jane',     lastName: 'Smith'  },
    { id: 3,    firstName: 'John',     lastName: 'Doe'    }
];

class Employees {

    lookupById (id) {
        return _.findWhere(data, { id: id });
    }

    lookupByLastName (lname) {
        return _.where(data, { lastName: lname });
    }

    addEmployee (fname, lname) {
        let max = _.max(data, function(employee) { return employee.id });
        let id = max.id ? max.id + 1 : 0;
        data.push({ id: id, firstName: fname, lastName: lname });
    }

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
