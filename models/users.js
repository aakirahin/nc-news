const db = require("../db/connection.js");

exports.selectUsers = () => {
  return db.query(`SELECT username FROM users;`).then((result) => {
    return result.rows;
  });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE users.username = $1;`, [username])
    .then((result) => {
      return result.rows[0];
    });
};
