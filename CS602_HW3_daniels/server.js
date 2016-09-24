'use strict';

const express = require('express');
const handlebars = require('express-handlebars');

// modules
const displayEmployees = require('./modules/displayEmployees');
const editEmployee = require('./modules/editEmployee');
const addEmployee = require('./modules/addEmployee');
const deleteEmployee = require('./modules/deleteEmployee');

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
    res.redirect('/employees');
});

app.get('/employees',           displayEmployees);

app.get('/editEmployee/:id',    editEmployee);

app.get('/addEmployee',         addEmployee);

app.post('/addEmployee',        addEmployee);

app.post('/editEmployee/:id',    editEmployee);

app.post('/deleteEmployee',     deleteEmployee);

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