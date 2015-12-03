'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var GitHubApi = require('github')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

module.exports = router;

//OP: GENERAL: code hygiene: unused dependecies, comments, console.logs

router.put('/:boardID/active', function(req, res, next) {
	var github = req.user.githubAccess;

	Board.findOneAndUpdate({ githubID: req.params.boardID}, { isActive: true}, {new : true})
	.then(function(board){
		//  console.info("board updated:", board)
		res.send(board)
	})

})
