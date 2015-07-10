var start = new Date().getTime();

var Memento = require('./index');

var mysqlConfig = {
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'benchmark'
};

var memcachedConfig = "127.0.0.1:11211";

var memento = new Memento({mysql: mysqlConfig, memcached: memcachedConfig});

memento.query('SELECT * FROM test LIMIT 1', function(err, rows, fields) {
	if (err) throw err;

	console.log(rows);
	var end = new Date().getTime();
	var time = end - start;
	console.log('Execution time: ' + time);
	
	memento.finish();
});


