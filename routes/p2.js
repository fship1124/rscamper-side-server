
module.exports = function(app) {
	var express = require('express');
	var route = express.Router();
	route.get('/r1', function(re, res) {
		console.log('Hello /p2/r1');
		res.send('Hello /p2/r1');
	});
	route.get('/r2', function(re, res) {
		console.log('Hello /p2/r2');
		res.send('Hello /p2/r2');
	});

	return route;
};

