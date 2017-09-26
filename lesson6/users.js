const {
    pool,
    mysql
} = require('./config');

const Users = {
    findOne: (username, password) => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            let user = {}
            const sql = mysql.format("SELECT * FROM ?? WHERE ??=? AND ??=?",
             ['users', 'username', username, 'password', password]);
            connection.query(sql, (err, rows) => {
                user = rows[0]                
                if (err) reject(err)                
                resolve(user)
            })            
        })
    })
}

module.exports = Users;
