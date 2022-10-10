const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv').config();
let dotenvExpand = require('dotenv-expand');
var _ = require('underscore-contrib'); 


// HOST = process.env.MYSQL_HOST
HOST = process.env.MYSQL_HOST || "localhost"
USER= process.env.MYSQL_USER || 'input'
PASSWORD=  process.env.MYSQL_PASSWORD || 'password'
DB =  process.env.MYSQL_DATABASE || 'webdata'
port =  process.env.MYSQL_PORT || 33061

// var host = process.env.MYSQL_HOST;
// var user = process.env.MYSQL_USER;
// var password = process.env.MYSQL_PASSWORD;
// var database = process.env.MYSQL_DATABASE;
// var port = process.env.MYSQL_PORT;
console.log("creating connection using the following parameters: ");
console.log(HOST, USER, PASSWORD, DB, port);

const con = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB,
    port: port
});

function dataValidation( height, weight, age) {
    if (isNaN(height) || isNaN(weight) || isNaN(age)) {
        return false;
    }else{
        return true;
    }
};

function insertData(name, height, weight, gender, age) {
    insert_query = `insert into webdata.input_data values ("${name}" , "${height}" ," ${weight} ", "${gender}", "${age}");`
    con.query(insert_query, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
}

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/input', function (request, response) {

    let redirected = false;
    let current_user = request.query.username
    console.log(current_user + ' just logged in')
    for (var i = 0; i < request.rawHeaders.length; i++) {
        if ('http://localhost:3000/' == request.rawHeaders[i]) {
            console.log(request.rawHeaders[i]);
            redirected = true;
        }
    }
    console.log(redirected);

    if (redirected) { response.sendFile(path.join(__dirname + '/input.html')); }
    else { response.redirect('http://localhost:3000'); }

    // response.sendFile(path.join(__dirname + '/input.html'));
});

app.post('/input_data', function (request, response) {
    // Capture the input fields

    let name = request.body.name;
    let height = request.body.height;
    let weight = request.body.weight;
    let gender = request.body.gender;
    let age = request.body.age;
    // Ensure the input fields exists and are not empty

    request.session.name = name
    request.session.loggedin = true;
    request.session.height = height;
    request.session.weight = weight;
    request.session.gender = gender;
    request.session.age = age;
    // Redirect to home page
    response.redirect('/home?username=' + name);



});



// http://localhost:3000/home
app.get('/home', function (request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        // Output username
        
        select_query = 'select * from test.info;'
        console.log("the current user is:", request.session.name)
        console.log('the height is:', request.session.height)
        console.log('the weight is:', request.session.weight)
        console.log('the gender is:', request.session.gender)
        console.log('the age is:', request.session.age)
        valid_data = dataValidation(request.session.height, request.session.weight, request.session.age)
        if (valid_data) {
            insertData(request.session.name, request.session.height, request.session.weight, request.session.gender, request.session.age)
            response.send('Welcome back, ' + request.session.name + '!\nYou just entered are :\n' + 'Height: ' + request.session.height + '\nWeight: ' + request.session.weight);
        }else{
            response.send('something went wrong with YOUR data')
        }
                
        
    } else {
        // Not logged in
        response.send('Please login to view this page!');
    }
    response.end();
});



app.listen(3001);