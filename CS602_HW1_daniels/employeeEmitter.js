'use strict';

const _ = require('underscore');
const EventEmitter = require('events').EventEmitter;

class EmployeeEmitter extends EventEmitter {
    constructor (data) {
        super();
        this.data = data;
    }

    lookupById (id) {
        this.emit('lookupById', id);

        console.log(_.findWhere(this.data, { id: id }));
    }

    lookupByLastName (lname) {
        this.emit('lookupByLastName', lname);

        return _.where(this.data, { lastName: lname });
    }

    addEmployee (fname, lname) {
        this.emit('addEmployee', fname, lname);

        let max = _.max(this.data, function(employee) { return employee.id });
        let id = max.id ? max.id + 1 : 0;
        this.data.push({ id: id, firstName: fname, lastName: lname });
    }
}

module.exports.EmployeeEmitter = EmployeeEmitter;