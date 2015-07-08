var mysql = require('mysql');

exports.bootstrap = function bootstrap(config) {
	Memento = require('./lib/Memento');
	return new Memento(config);
};
	
