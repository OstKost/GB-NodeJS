const db = require('./config')
const pool = db.pool
const mysql = db.mysql

const Tasks = {
    list: (callback) => {
        pool.getConnection((err, connection) => {
            if (err) console.log(err)
            const sql = mysql.format("SELECT * FROM ??", ['tasks'])
            connection.query(sql, (err, rows) => {
                connection.release()
                callback(err, rows)
            })
        })
    },

    add: (data, callback) => {
        pool.getConnection((err, connection) => {
            if (err) console.log(err)
            let sql = 'INSERT INTO ??(??, ??, ??) VALUES (?,?,?)'
            const inserts = ['tasks', 'name', 'description', 'priority', data.name, data.description, data.priority]
            sql = mysql.format(sql, inserts)
            connection.query(sql, (err, rows) => {                
                connection.release()
                Tasks.list(callback)
            })
        })
    },

    change: (id, text, callback) => {

    },

    complete: (id, callback) => {

    },

    delete: (id, callback) => {

    }
};

module.exports = Tasks;