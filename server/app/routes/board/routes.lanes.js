var router = require('express').Router();
var Lane = require('mongoose').model('Lane');

module.exports = router;

router.get('/:boardID', function(req, res, next) {
	Lane.find({active: true, board: req.params.boardID})
	.then(function(lanes) {
		res.send(lanes);
	})
	.then(null, next);
});

router.post('/', function(req, res, next) {
	Lane.create({title: req.body.title, active: true, board: req.body.boardID})
	.then(function(lane) {
		res.send(lane);
	})
	.then(null, next);
});

router.delete('/', function(req, res, next) {
	Lane.remove({title: req.body.title, board: req.body.boardID})
	.then(function() {
		res.send();
	})
	.then(null, next);
});
