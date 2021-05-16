'use strict';
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const fs = require("fs");
const msg404 = 'BAD PROBLEM!';
const { JSDOM } = require('jsdom');

app.use('/css', express.static('pvt/css'));
app.use('/img', express.static('pvt/img'));
app.use('/js', express.static('pvt/js'));
app.use('/font', express.static('pvt/font'));
app.use('/html', express.static('pvt/html'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    let results = await dbConnection.query("SELECT COUNT(*) FROM user");
    console.log(results);
    let count = results[0][0]['COUNT(*)'];

    if (count < 1) {
        results = await dbConnection.query("INSERT INTO user (email, password) values ('arron_ferguson@bcit.ca', 'admin')");
        console.log("Added test user.");
    }
    dbConnection.end();
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

    console.log("received login request");

    console.log(req);

    console.log("Email", req.body.email);
    console.log("Password", req.body.pword);

    let results = checkAuth(req.body.email, req.body.pword,
        function (selection) {
            if (selection == null) {
                res.send({ status: "fail", msg: "NSA" });
            } else {
                req.session.loggedIn = true;
                req.session.email = selection.email;
                req.session.save();
//                res.redirect('/contentful');
                res.send({ status: "success", msg: "OK" });
            }
        });

});

function checkAuth(email, pwd, callback) {

    const mysql = require('mysql2');
    const dbConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'g11asn3'
    });

    dbConnection.query(
        "SELECT * FROM user WHERE email = ? AND password = ?", [email, pwd],
        function (error, result) {
            if (error) {
                throw error;
            }

            if (result.length > 0) {
                return callback(result[0]);
            } else {
                return callback(null);
            }
            //he's making a list
            //it's stored in plain text
            //an elf just got phished
            //you know what comes next
            //Santa Claus has leaked 7 billion users' names, adresses and social security numbers.
        });
}

app.get('/contentful', function (req, res) {

    console.log("got contentful request");

    res.set('Server', 'CryEngine');
    res.set('X-Powered-By', 'my tears');

    if (!req.session.loggedIn) {
        console.log("not logged in");
        res.status(403).send((new JSDOM(fs.readFileSync('./pvt/html/403.html'))).serialize());
        return;
    }

    let baseFile = fs.readFileSync('./pvt/html/contentful.html', "utf8");
    let baseDOM = new JSDOM(baseFile);
    let $base = require("jquery")(baseDOM.window);

    let item = fs.readFileSync('./pvt/html/template_test_item.html', "utf8");
    let itemDOM = new JSDOM(item);
    let $item = require("jquery")(itemDOM.window);
    // Replace!
    $base("#replaceable").replaceWith($item("#test_item"));

    res.send(baseDOM.serialize());

});

app.use(function (req, res, next) {
    res.status(404).send(msg404);
});

let port = 451;
app.listen(port, function () {
    initDatabase();
    console.log('Ready at port ' + port);
});