'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();
const title = 'Add Employee';
const action = '/addEmployee';
const errorMsg = 'There was a problem adding the employee. See error below';

module.exports = function addEmployee(req, res, next) {

    let postData = req.body;
    let fname = postData.fname;
    let lname = postData.lname;
    let data = { title: title, action: action };

    if(req.method === 'POST') {
        if (fname && lname) {
            let employee = new Employee({ firstName: fname, lastName: lname }); 

            employee.save((err) => {
                if (err) {
                    throw err
                }
                console.log("Success!");
                res.redirect('/employees?add=true');
            });
        } else {
            data.error = errorMsg;
            data.employee = { firstName: fname, lastName: lname };
            res.render('html/employeeForm', data);
        }   
    } else {
        res.render('html/employeeForm', data);
    }
};
