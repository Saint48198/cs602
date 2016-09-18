const express = require('express');
const handlebars = require('express-handlebars');

const app = express();

app.engine('handlebars', handlebars({ defaultLayout:  __dirname + '/layouts/main' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// app routes [START]
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/id/:id', (req, res) => {

});

app.get('/lastName/:name', (req, res) => {

});

app.get('/addEmployee', (req, res) => {

});

app.post('/addEmployee', (req, res) => {
    res.render('addEmployee');
});

app.use((req, res) => {
    res.status(404);
    res.render('views/404');
});
// app routes [END]

app.listen(3000, () => {
    console.log('http://localhost:3000');
});