const pool = require('./config').pool;

const Users = {
    create: data => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            const sql = 'INSERT INTO `users` SET ?'                        
            connection.query(sql, data, (err, results) => {
                if (err || !results) reject(err)                            
                resolve(results)
            })
        })
    }),

    checkLogin: data => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {            
            if (err) reject(err)         
            const sql = "SELECT `username` FROM `users` WHERE `username`=? AND `password`=?"                        
            connection.query(sql, [data.username, data.password], (err, results, fields) => {                
                // SELECT `username`,`password` FROM `users` WHERE `username`='admin' AND `password`='21232f297a57a5a743894a0e4a801fc3'                                                                                 
                if (err || !results.length) reject(err)              
                resolve(results[0])
            })
        })
    }),

    findOne: data => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            const sql = "SELECT 'username' FROM users WHERE ?"
            connection.query(sql, data, (err, results) => {
                if (err || !results.length) reject(err)                             
                resolve(results[0])                
            })
        })
    })
}

module.exports = Users;
