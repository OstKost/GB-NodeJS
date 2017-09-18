const tasks = require('./tasks')
const mysql = require('mysql')

const pool = mysql.createPool({
    host: 'localhost',
    database: 'todo',
    user: 'root',
    password: ''
})

pool.getConnection((err, connection) => {
    if (err) console.log(err)
    // используем полученное соединение
    connection.query('SELECT * FROM tasks', (err, rows) => {

        console.log(rows)

        // возвращаем соединение в пул
        connection.release()
    })
})