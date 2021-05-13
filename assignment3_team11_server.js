'use strict';
const express = require('express');
const session = require('express-session');
const app = express();
const fs = require("fs");
const msg404 = 'BAD PROBLEM!';


app.use('/css', express.static('pvt/css'));
app.use('/img', express.static('pvt/img'));
app.use('/js', express.static('pvt/js'));
app.use('/font', express.static('pvt/font'));

app.get('/favicon.ico', function (req, res) {
    res.setHeader('Content-Type', 'image/x-icon');
    fs.createReadStream("./pvt/img/favicon.ico").pipe(res);
});

app.use(session(
    {
        secret: 'pteryx',
        resave: false,
        saveUninitialized: true
    }));

async function initDatabase() {

    const mysql = require('mysql2/promise');

    const dbConnection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        multipleStatements: true
    });

    const createStatement = `CREATE DATABASE IF NOT EXISTS g11asn3;
        use g11asn3;
        CREATE TABLE IF NOT EXISTS user (
        ID int NOT NULL AUTO_INCREMENT,
        email varchar(30),
        password varchar(30),
        PRIMARY KEY (ID));`;

    await dbConnection.query(createStatement);
    let results = await connection.query("SELECT COUNT(*) FROM user");
    let count = results[0][0]['COUNT(*)'];

    if (count < 1) {
        results = await connection.query("INSERT INTO user (email, password) values ('arron_ferguson@bcit.ca', 'admin')");
        console.log("Added test user.");
    }
    connection.end();
}

app.get('/', function (req, res) {

    res.set('Server', 'CryEngine');
    res.set('X-Powered-By', 'my tears');

    fs.readFile("./index.html", function (error, pgRes) {
        if (error) {
            res.writeHead(404);
            res.write(msg404);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pgRes);
        }
        res.end();
    });
});

app.post('/auth-user', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    console.log("Email", req.body.email);
    console.log("Password", req.body.password);

    const mysql = require('mysql2');  
    const dbConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
    });
    console.log(req.body);
    let checkResult = dbConnection.query("SELECT COUNT(*) FROM user WHERE email = ? AND password = ?", [req.body.email, req.body.pwd]);

    

});

app.use(function (req, res, next) {
    res.status(404).send(msg404);
});

let port = 451;
app.listen(port, function () {
    console.log('Ready at port ' + port);
});