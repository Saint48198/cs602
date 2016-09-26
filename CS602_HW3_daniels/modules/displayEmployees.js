'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();
const title = 'Employees';

module.exports = function displayEmployees(req, res, next) {
    let queryData = req.query;
    let alertMessage = '';

    if (queryData.delete) {
        alertMessage = 'Employee was successfully deleted!';
    } else if (queryData.add) {
        alertMessage = 'Employee was successfully created!';
    } else if (queryData.update) {
        alertMessage = 'Employee was successfully updated!';
    }
    
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

        res.render('html/employeeList', { title: title, employee: results, alert: alertMessage });
    })
};
