'use strict';

const express = require('express');
const handlebars = require('express-handlebars');

// functions for getting and adding employees
const employeeModule = require('./employeeModule');

// declare app
const app = express();

// to parse request body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// temmplate settings
app.engine('handlebars', handlebars({ defaultLayout:  __dirname + '/layouts/html' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// static resources
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// app routes [START]
app.get('/', (req, res) => {
    console.log(req);
    res.render('html/home');
});

app.get('/id/:id', (req, res) => {
    let paramsData = req.params;
    let id = parseInt(paramsData.id);
    let intro = 'Employee with the ID ' + id;
    let employee = employeeModule.lookupById(id);

    // render the content based of the request header
    if (isJson(req.headers.accept)) {
        res.type('application/json');
        res.send(employee);
    } else if (isXML(req.headers.accept)) {
        res.type('application/xml');
        res.render('xml/employee', { layout: __dirname + '/layouts/xml', employee: employee });
    } else {
        res.render('html/employee', { employee: employee, intro: intro });
    }
});

app.get('/lastName/:name', (req, res) => {
    let paramsData = req.params;
    let queryData = req.query;
    let name = paramsData.name;
    let intro = 'Employees with the Last Name ' + name;
    let employees = employeeModule.lookupByLastName(name);
    let newEmployee;
    let alert = 'The employee with ID <b>{{id}}</b> was added!' 

    // updated alert message template of the last employee added to the records
    if (queryData.new === 'true') {
        newEmployee = employees[employees.length - 1];
        alert = alert.replace('{{id}}', newEmployee.id);
    }

    // render the content based of the request header
    if (isJson(req.headers.accept)) {
        res.type('application/json');
        res.send(employees);
    } else if (isXML(req.headers.accept)) {
        res.type('application/xml');
        res.render('xml/employeeList', { layout: __dirname + '/layouts/xml', employee: employees });
    } else {
        // render the html template, don't show the alert unless there is a new employee
        res.render('html/employeeList', { employee: employees, intro: intro, alert: newEmployee ? alert : '' });
    }
});

app.get('/addEmployee', (req, res) => {
    res.render('html/addEmployee');
});

app.post('/addEmployee', (req, res) => {
    let postData = req.body;
    let fname = postData.fname;
    let lname = postData.lname;

    // simple error handling, don't add an employee unless they have both a first and last name
    if (lname && fname) {
        employeeModule.addEmployee(fname, lname);
        // display the employees with the same last name on success
        res.redirect('/lastName/' + lname + '?new=true'); 
    } else {
        res.render('html/addEmployee', { error: true, fname: fname, lname: lname });
    }
});

app.use((req, res) => {
    res.status(404);
    res.render('html/404');
});
// app routes [END]

// server 
app.listen(3000, () => {
    console.log('http://localhost:3000');
});

// helper functions
function isJson (header) {
    return header === 'application/json';
}

function isXML (header) {
    return header === 'application/xml';
}