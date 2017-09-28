const mysql = require('mysql')

const DB = {
    pool: mysql.createPool({
        host: 'localhost',
        database: 'todo',
        user: 'root',
        password: ''
    }),
    mysql: mysql
}

module.exports = DB;
