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
        // simple error handling for the posted form (must have a first name and last name)
        if (fname && lname) {
            Employee.findOneAndUpdate({ _id: id }, { firstName: fname, lastName: lname }, { upsert: true }, (err, doc) => {
                if (err) {
                    displayView(err, doc);
                } else {
                    res.redirect('/employees?update=true');
                }

            });
        } else {
            // show form with errors
            displayView(errorMsg, { firstName: fname, lastName: lname });
        }   
    } else {
        Employee.findById(id, displayView);
    }

    /**
     * function displayView
     * used for updated UI view for the various states
     * Arguments: err<string>, employee<object>
     */
    function displayView (err, employee) {
        const uTitle = title + ': ' + employee.lastName + ', ' + employee.firstName;
        const action = '/editEmployee/' + id;

        if (err) {
            console.log('Error: %s', err);
        }

        res.render('html/employeeForm', { title: uTitle, employee: employee , action: action, error: err });
    };
};