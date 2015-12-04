'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var Board = require('mongoose').model('Board');

module.exports = router;

router.put('/:boardID/active', function(req, res, next) {
	var github = req.user.githubAccess;

	Board.findOneAndUpdate({ githubID: req.params.boardID}, { isActive: true}, {new : true})
	.then(function(board){
		res.send(board)
	})

})
