'use strict';

const DB = require('../dbConnection');
const Employee = DB.getModel();
const title = 'Add Employee';

module.exports = function addEmployee(req, res, next) {

    res.render('html/employeeForm', { title: title, intro: title });
};