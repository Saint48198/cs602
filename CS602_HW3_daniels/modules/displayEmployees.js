'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();
const title = 'Employees';

module.exports = function displayEmployees(req, res, next) {
    Employee.find({}, (err, employee) => {
        if (err) {
            console.log('Error: %s', err);
        }

        let results = employee.map((employee) => {
            return {
                id: employee.id,
                lastName: employee.lastName,
                firstName: employee.firstName
            }
        });

        res.render('html/employeeList', { title: title, employee: results , intro: title });
    })
};
