require('dotenv').config();
var mysql = require('mysql2');

var conn = mysql.createConnection({
  host: process.env.DB_HOST,     // .env se value read karega
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT      // Optional: agar required ho toh
});

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully!');
});

module.exports = conn;
