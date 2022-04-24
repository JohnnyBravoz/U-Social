const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '18.117.193.160',
    user: 'user',
    password: 'password',
    database: 'usocial',
    multipleStatements: 'true',
    port: '3306'
});

connection.connect( (error) => {
    if(!!error) console.log(error);
    else console.log('Conection to the database is succesful');
});

module.exports = connection;
