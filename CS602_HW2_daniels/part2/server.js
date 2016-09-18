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

// app routes [START]
app.get('/', (req, res) => {
    console.log(req);
    res.render('html/home');
});

app.get('/id/:id', (req, res) => {
    if (isJson(req.headers.accept)) {
        res.type('application/json');
        res.send(employeeModule.lookupById(0));
    } else if (isXML(req.headers.accept)) {
        res.type('application/xml');
        res.render('xml/employeeList', { layout: __dirname + '/layouts/xml', employee: [employeeModule.lookupById(0)] });
    } else {
        res.render('html/employeeList', { employee: [employeeModule.lookupById(0)] });
    }
});

app.get('/lastName/:name', (req, res) => {
    let paramsData = req.params;
    let name = paramsData.name;
    let intro = 'Employees with the Last Name ' + name;

    if (isJson(req.headers.accept)) {
        res.type('application/json');
        res.send(employeeModule.lookupByLastName(name));
    } else if (isXML(req.headers.accept)) {
        res.type('application/xml');
        res.render('xml/employeeList', { layout: __dirname + '/layouts/xml', employee: employeeModule.lookupByLastName(name) });
    } else {
        res.render('html/employeeList', { employee: employeeModule.lookupByLastName(name), intro: intro });
    }
});

app.get('/addEmployee', (req, res) => {
    res.render('html/addEmployee');
});

app.post('/addEmployee', (req, res) => {
    
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