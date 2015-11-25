'use strict';
var router = require('express').Router();
var GitHubApi = require('github')
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')
var Board = require('mongoose').model('Board')

module.exports = router;


router.get('/get/all', function(req, res, next) {
	var github = new GitHubApi({ debug: true, version: "3.0.0" } );

	github.authenticate({
			type: "oauth",
			token: req.user.accessToken
	});

	github.repos.getAll({}, function(err, data) {
		if(err) console.error(err)

		 data = data.map(function(repo) {
			return payloadParser.repo(repo)
		})

		Promise.map(data, function(board) {
			console.log("Finding the Board, it is: ", board)
			return Board.findOne({githubID: board.githubID})
		})
		.then(function(boards) {
			console.log("Found the Boards, they are: ", boards)
			return Promise.map(boards, function(board, index) {
				if(!board) board = {githubID: null}
				return Board.findOneAndUpdate({ githubID: board.githubID}, data[index], {upsert: true, new: true})
			})
		})
		.then(function(boards) {
			console.log("Updated Boards", boards)
			res.send(boards)
		})

	})

});



router.get('/get/:repo', function(req, res, next) {
	var github = new GitHubApi({ debug: true, version: "3.0.0" } );

	github.authenticate({
			type: "oauth",
			token: req.user.accessToken
	});
	console.log("----req user", req.user)

	github.repos.get({user: req.user.username, repo: req.params.repo}, function(err, data) {
		if(err) console.error(err)

		data = payloadParser.repo(data)

		Board.findOneAndUpdate({ githubID: data.githubID}, data, {upsert: true, new: true})
		.then(function(board) {
			console.log("Updated Board", board)
			res.send(board)
		})
	})

});

router.put('/put/:boardID/active', function(req,res,next){
	var github = new GitHubApi({ debug: true, version: "3.0.0" } );

	github.authenticate({
			type: "oauth",
			token: req.user.accessToken
	});

	Board.findOneAndUpdate({ githubID: req.params.boardID}, { isActive: true}, {new : true})
	.then(function(board){
		console.log("board updated:", board)
		res.send(board)
	})

})