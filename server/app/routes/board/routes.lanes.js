//var router = require('express').Router();
//var Lane = require('mongoose').model('Lane');
//
//module.exports = router;
//
//router.get('/:repoID', function(req, res, next) {
//	Lane.find({active: true, repo: req.params.repoID})
//	.then(function(lanes) {
//		res.send(lanes);
//	})
//	.then(null, next);
//});
//
//router.post('/', function(req, res, next) {
//	Lane.create({title: req.body.title, active: true, repo: req.body.repoID})
//	.then(function(lane) {
//		res.send(lane);
//	})
//	.then(null, next);
//});
//
//router.delete('/', function(req, res, next) {
//	Lane.remove({title: req.body.title, repo: req.body.repoID})
//	.then(function() {
//		res.send();
//	})
//	.then(null, next);
//});
