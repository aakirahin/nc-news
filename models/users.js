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

exports.editAvatar = (
  username,
  url = "https://cdn.pixabay.com/photo/2016/03/31/14/47/avatar-1292817_960_720.png"
) => {
  return db
    .query(
      `UPDATE users 
      SET avatar_url = $1 
      WHERE username = $2
      RETURNING *;`,
      [url, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.addNewUser = (
  username,
  name,
  url = "https://cdn.pixabay.com/photo/2016/03/31/14/47/avatar-1292817_960_720.png"
) => {
  return db
    .query(
      `INSERT INTO users
      (username, avatar_url, name)
      VALUES
      ($1, $2, $3)
      RETURNING *`,
      [username, url, name]
    )
    .then((result) => {
      return result.rows[0];
    });
};
