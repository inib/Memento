var crypto = require('crypto');
var hash = crypto.createHash('sha512');
var hashHex = hash.digest('hex');
console.log(hashHex);

var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'benchmark'
});

connection.connect();

connection.query('SELECT * FROM test', function(err, rows, fields) {
  if (err) throw err;

  console.log(rows);
});

connection.end();
