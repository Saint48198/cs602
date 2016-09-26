'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();
const title = 'Edit Employee';
const errorMsg = 'There was a problem editing the employee. See error below';

module.exports = function editEmployee(req, res, next) {
    let paramsData = req.params;
    let id = paramsData.id;

    let postData = req.body;
    let fname = postData.fname;
    let lname = postData.lname;

    if(req.method === 'POST') {
        if (fname && lname) {
            Employee.findOneAndUpdate({ _id: id }, { firstName: fname, lastName: lname }, { upsert: true }, (err, doc) => {
                if (err) {
                    displayView(err, doc);
                } else {
                    res.redirect('/employees?update=true');
                }

            });
        } else {
            displayView(errorMsg, { firstName: fname, lastName: lname });
        }   
    } else {
        Employee.findById(id, displayView);
    }


    function displayView (err, employee) {
        const uTitle = title + ': ' + employee.lastName + ', ' + employee.firstName;
        const action = '/editEmployee/' + id;

        if (err) {
            console.log('Error: %s', err);
        }

        res.render('html/employeeForm', { title: uTitle, employee: employee , action: action, error: err });
    };
};