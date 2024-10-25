const mysql = require("mysql2/promise");

const poll = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  database: "dis",
  password: "qwerty",
});

module.exports = poll;
