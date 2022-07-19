"use strict";
var express = require('express');
var router = express.Router();
var fs = require('fs');
router.get('/getData', function(req, res, next){
	fs.readFile('./configer/detail.json', 'utf-8', function (err, data) {
		try {
			if (data) {
				res.send({code: 200, data: JSON.parse(data)})
			}
		} catch(err) {
			console.log('err', err);
		}
	});
})
router.post('/setData', function(req, res, next){
	var str = JSON.stringify(req.body.data)
	console.log(str)
	fs.writeFile('./configer/detail.json', str, function (err) {
		try {
			res.send({code: 200})
		} catch(err) {
			console.log('err', err);
		}
		
	});
})
router.post('/signUser', function(req, res, next){
	var str = JSON.stringify(req.body.data)
	console.log(str)
	fs.writeFile('./configer/user.json', str, function (err) {
		try {
			res.send({code: 200})
		} catch(err) {
			console.log('err', err);
		}
		
	});
})
router.get('/getUser', function(req, res, next){
	fs.readFile('./configer/user.json', 'utf-8', function (err, data) {
		try {
			if (data) {
				res.send({code: 200, data: JSON.parse(data)})
			}
		} catch(err) {
			console.log('err', err);
		}
	});
})
module.exports = router;

