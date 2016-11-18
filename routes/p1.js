
module.exports = function(app) {
	var express = require('express');
	var route = express.Router();
	route.get('/r1', function(req, res) {
		console.log('Hello /p1/r1');
		res.send('Hello /p1/r1');
	});
	route.get('/r2', function(req, res) {
		console.log('Hello /p1/r2');
		res.send('Hello /p1/r2');
	});
	
	return route;
};