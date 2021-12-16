const format = require("pg-format");
const db = require("../db/connection.js");

exports.checkExists = (table, column, value) => {
  if (!value) {
    return "Nothing to check";
  }
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  return db.query(queryStr, [value]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Data not found",
      });
    }
    return value;
  });
};

exports.checkValid = (id) => {
  if (!id) {
    return "Nothing to check";
  } else if (!/\d+/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid data type",
    });
  }
};
