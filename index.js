const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/points', (req, res) => {
    res.render('points');
})

app.get('/planning', (req, res) => {
    res.render('planning');
})

app.get('/expenses', (req, res) => {
    res.render('expenses');
})

app.get('/community', (req, res) => {
    res.render('community');
})

app.get('/savings-plan', (req, res) => {
    res.render('savings-plan');
})

app.get('/projection', (req, res) => {
    res.render('projection');
})

app.get('/recommendation', (req, res) => {
    res.render('recommendation');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})