const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin1234@',
  database: 'sales_db',
  port: 3307
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('MySQL Connected');
  }
});

module.exports = db;