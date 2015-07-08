var crypto = require('crypto');
var mysql = require('mysql');
var Memcached = require('memcached');

module.exports = Memento;

function Memento(config) {
	this.version = "1.0.0";
	this.cacheTimeout = 300;
	this.config = config;
	
	this.MysqlConnection = mysql.createConnection(config["mysql"]);
	this.MysqlConnection.connect();
	
	this.MemcachedConnection = new Memcached(config["memcached"]);
}

Memento.prototype.query = function(sql, callback) {
	
	var hash = crypto.createHash('sha512', sql);
	var queryHash = hash.digest('hex');
	
	var parent = this;
	
	parent.MysqlConnection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		
		parent.MemcachedConnection.get(queryHash, function (err, data) {
			if (err) throw err;
			
			if (!data) {
				parent.MemcachedConnection.set(queryHash, rows, parent.cacheTimeout, function(err) {
					if (err) throw err;
				});
				
				callback(err, rows, fields);
			} else {
				callback(err, data, fields);
			}			
		});
	});
};
