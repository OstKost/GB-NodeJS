const {
    pool,
    mysql
} = require('./config');

const Users = {
    checkLogin: (username, password) => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            const sql = mysql.format("SELECT * FROM users WHERE username=? AND password=?", [username, password])
            connection.query(sql, (err, results) => {
                if (err || !results) reject(err)              
                resolve(results[0])
            })
        })
    }),

    findOne: username => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            const sql = mysql.format("SELECT 'username' FROM users WHERE username=?", [username])
            connection.query(sql, (err, results) => {
                if (err || !results) reject(err)              
                resolve(results[0])
            })
        })
    })
}

module.exports = Users;
