const mysql = require('mysql');

const con = mysql.createConnection({
    host: "0.0.0.0",
    user: "input",
    password: "password",
    database: "webdata",
    port: 33061
});

sql = 'create table if not exists input_data (name varchar(255), height int, weight int , gender varchar(255), age int)';

// sql = 'SELECT * FROM test.info';
con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
    con.end();
});

