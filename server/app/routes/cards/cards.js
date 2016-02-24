'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')
var Lane = require('mongoose').model('Lane');
var Sprint = require('mongoose').model('Sprint');
var Card = require('mongoose').model('Card');
var Board = require('mongoose').model('Board');

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
		issue.lane = req.body.lane
		issue.board = req.body.board._id

		return Card.create(issue)
	})
	.then(function(card) {
		return Lane.populate(card, {path: 'lane', model: 'Lane'})
	})
	.then(function(card) {
		res.send(card)
	})

})

router.put('/priority/many', function(req, res, next) {

	var cards = req.body

	Promise.map(cards, function(card) {
		return Card.findOneAndUpdate({githubId: card.githubId}, card, {new: true})
	})
	.then(function(cards) {
		res.send(cards)
	})

})

router.put('/title/:cardId', function(req, res, next){
	var github = req.user.githubAccess;
	//Github module has a method 'githubissues.edit', there is no 'issues.updateTitle'
	var updateTitleAsync = Promise.promisify(github.issues.edit)

	//body of a request we'll send to Github, including an updated Title
	var msg = {
		user: null,
		repo: null,
		number: req.body.issueNumber,
		title: req.body.title
	}

	Board.findById(req.body.board)
	.then(function(board){
		//Send the comment to Github with msg body
		msg.repo = board.name
		msg.user = req.user.username
		var updateTitleAsync = Promise.promisify(github.issues.edit);
		return updateTitleAsync(msg)
	})
	.then(function(response){
		return Card.findOne({ githubId: req.params.cardId })
	})
	.then(function(foundCard){
			foundCard.title = req.body.title;
			return foundCard.save()
	})
	.then(function(savedCard){
		res.send(savedCard)
	})
})

router.put("/storyPoints/:cardId",function(req,res,next){
	Card.findById(req.params.cardId)
	.then(function(foundCard){
		foundCard.storyPoints=req.body.storyPoints;
		return foundCard.save()
	})
	.then(function(savedCard){
		res.send(savedCard);
	})
})

router.put("/sprint/:cardId/:sprintId",function(req,res){
	Card.findById(req.params.cardId)
	.then(function(foundCard){
		return foundCard;
	})
	.then(function(foundCard){
		return Sprint.findById(req.params.sprintId)
		.then(function(foundSprint){
			foundCard.sprint=foundSprint;
			return foundCard.save()
		})
	})
	.then(function(savedCard){
		res.send(savedCard)
	})
})
