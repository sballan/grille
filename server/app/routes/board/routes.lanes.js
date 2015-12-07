var router = require('express').Router();
var Lane = require('mongoose').model('Lane');

module.exports = router;

//OP: redundant naming, don't need to include "/get"
router.get('/get/:boardID', function(req, res, next) {
	Lane.find({active: true, board: req.params.boardID})
	.then(function(lanes) {
		res.send(lanes);
	})
	.then(null, next);
});

//OP: redundant naming, don't need to include "/post"
router.post('/post/:boardID/:laneTitle', function(req, res, next) {
	Lane.create({title: req.params.laneTitle, active: true, board: req.params.boardID})
	.then(function(lane) {
		res.send(lane);
	})
	.then(null, next);
});

//OP: redundant naming, don't need to include "/delete"

// NOTE Consider deleting by lane._id, probably an optimisation.
router.delete('/delete/:boardID/:laneTitle', function(req, res, next) {
	Lane.remove({title: req.params.laneTitle, board: req.params.boardID})
	.then(function() {
		res.send();
	})
	.then(null, next);
});
