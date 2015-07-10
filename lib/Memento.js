/*

	Memento - MySQL query caching for Node.js
	http://github.com/maxlabelle/Memento
	Released under the BSD license

*/

var crypto = require('crypto');
var mysql = require('mysql');
var Memcached = require('memcached');

module.exports = Memento;

function Memento(config) {
	this.version = "1.0.0";
	this.cacheTimeout = 300;
	this.config = config;
	
	this.MysqlConnection = mysql.createConnection(config["mysql"]);
	
	this.MemcachedConnection = new Memcached(config["memcached"]);

	for (var x = 0; x < 10000; x++) {
		var queryHash = crypto.createHash('sha512').update(x.toString()).digest("hex");
		this.MysqlConnection.query("INSERT INTO test(data) values('"+queryHash+"')");
	}

}

Memento.prototype.query = function(sql, callback) {	
	var parent = this;
	
	var queryHash = crypto.createHash('sha512').update(sql).digest("hex");
	
	parent.MemcachedConnection.get(queryHash, function (err, data) {
		if (err) throw err;
		
		if (!data) {
			parent.MysqlConnection.query(sql, function(err, rows, fields) {
				if (err) throw err;	

				parent.MemcachedConnection.set(queryHash, rows, parent.cacheTimeout, function(err) {
					if (err) throw err;
				});
				
				callback(err, rows, fields);
			});				
		} else {
			callback(null, data, null);
		}		
	});
};

Memento.prototype.finish = function() {
	this.MysqlConnection.end();
	this.MemcachedConnection.end();
	process.exit();
};
