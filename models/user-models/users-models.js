const db = require("../../db/connection.js");

exports.getAllUsers = () => {
    
    const sqlQuery = `
    SELECT *
    FROM users
    `

    return db.query(sqlQuery).then(({ rows }) => {
        return rows
    })
}