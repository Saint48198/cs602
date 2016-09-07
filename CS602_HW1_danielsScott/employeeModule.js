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

    }
}

const theEmployees = new Employees();

module.exports.lookupById = theEmployees.lookupById;

module.exports.lookupByLastName = theEmployees.lookupByLastName;

module.exports.addEmployee = theEmployees.addEmployee;