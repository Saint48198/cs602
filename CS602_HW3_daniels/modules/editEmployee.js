'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();
const title = 'Edit Employee';

module.exports = function editEmployee(req, res, next) {
    let paramsData = req.params;
    let id = paramsData.id;

    Employee.find({_id: id }, (err, employee) => {
        if (err) {
            console.log('Error: %s', err);
        }
        let uTitle = title + ': ' + employee.lastName + ', ' + employee.firstName ;
        let results = employee.map((employee) => {
            return {
                id: employee._id,
                lastName: employee.lastName,
                firstName: employee.firstName
            }
        });

        res.render('html/employeeForm', { title: uTitle, employee: results , intro: uTitle });
    })
};