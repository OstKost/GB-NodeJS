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
                Tasks.list(callback) // Такая запись верна?
            })
        })
    },

    change: (id, data, callback) => {
        pool.getConnection((err, connection) => {
            if (err) console.log(err)
            let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?"            
            const inserts = ['tasks', 'priority', data.priority, 'id', id]
            sql = mysql.format(sql, inserts)
            connection.query(sql, (err, rows) => {                
                connection.release()
                Tasks.list(callback)
            })
        })        
    },

    complete: (id, data, callback) => {
        pool.getConnection((err, connection) => {
            if (err) console.log(err)
            let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?"                   
            const inserts = ['tasks', 'status', data.status == 0 ? 1 : 0, 'id', id]
            sql = mysql.format(sql, inserts)
            connection.query(sql, (err, rows) => {                
                connection.release()
                Tasks.list(callback)
            })
        })
    },

    delete: (id, callback) => {
        pool.getConnection((err, connection) => {
            if (err) console.log(err)
            const sql = mysql.format("DELETE FROM ?? WHERE ?? = ?", ['tasks', 'id', id])            
            connection.query(sql, (err, rows) => {                
                connection.release()
                Tasks.list(callback) 
            })
        })
    }
};

module.exports = Tasks;
