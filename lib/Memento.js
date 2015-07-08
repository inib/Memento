var crypto = require('crypto');
var mysql = require('mysql');
var Memcached = require('memcached');

module.exports = Memento;

function Memento(config) {
	this.version = "1.0.0";
	this.config = config;
	
	this.MysqlConnection = mysql.createConnection(config["mysql"]);
	this.MemcachedConnection = new Memcached(config["memcached"]);

	return;
}

Memento.query = function query(sql, values, callback) {
	var hash = crypto.createHash('sha512', sql);
	var queryHash = hash.digest('hex');
};
