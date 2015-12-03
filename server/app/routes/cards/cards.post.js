'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var GitHubApi = require('github')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

module.exports = router;

router.post('/', function(req, res, next) {
	var github = req.user.githubAccess;

	var createIssueAsync = Promise.promisify(github.issues.create)

	var msg = {
		user: req.body.board.owner.username,
		repo: req.body.board.name,
		title: req.body.title,
		body: req.body.body
	}

	createIssueAsync(msg)
	.then(function(issue) {

		issue = payloadParser.issue(issue)
		issue.lane = req.body.lane._id
		issue.board = req.body.board._id
		return Card.create(issue)
	})
	.then(function(card) {
		console.log("-----BACKEND CARD", card)
		res.send(card)
	})

})