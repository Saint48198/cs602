'use strict';

const _ = require('underscore');
const EventEmitter = require('events').EventEmitter;

class EmployeeEmitter extends EventEmitter {
    /**
     * Employee emitter class constructor
     * Arguments: employee data <array> 
     **/
    constructor (data) {
        super();
        this.data = data;
    }

    /** 
    * Function for looking up Employees by ID number.
    * Arguments: ID <integer> 
    * Returns: employee object (found) or undefined (not found)
    **/
    lookupById (id) {
        this.emit('lookupById', id);

        return _.findWhere(this.data, { id: id });
    }

    /**
     * Function for looking yp employees by last name
     * Arguments: Last Name <string>
     * Returns: array of employees (found) or empty array (not found)
     **/
    lookupByLastName (lname) {
        this.emit('lookupByLastName', lname);

        return _.where(this.data, { lastName: lname });
    }

    /**
     * Function for adding new employees 
     * Arguments: first name <string>, last name <string>
     **/
    addEmployee (fname, lname) {
        this.emit('addEmployee', fname, lname);

        let max = _.max(this.data, function(employee) { return employee.id });
        let id = max.id ? max.id + 1 : 0;
        this.data.push({ id: id, firstName: fname, lastName: lname });
    }
}

module.exports.EmployeeEmitter = EmployeeEmitter;