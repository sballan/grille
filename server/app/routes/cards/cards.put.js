'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')
var Sprint = require('mongoose').model('Sprint');
var Card = require('mongoose').model('Card');
var Board = require('mongoose').model('Board');

module.exports = router;

router.put('/priority/many', function(req, res, next) {

	var cards = req.body

	Promise.map(cards, function(card) {
		return Card.findOneAndUpdate({githubID: card.githubID}, card, {new: true})
	})
	.then(function(cards) {
		res.send(cards)
	})

})

router.put('/lane/many', function(req, res, next) {

	var cards = req.body

	Promise.map(cards, function(card) {
		return Card.findOneAndUpdate({githubID: card.githubID}, card, {new: true})
	})
	.then(function(cards) {
		res.send(cards)
	})

})

router.put('/lane/:cardID', function(req, res, next) {

	var card = req.body
	Card.findOneAndUpdate({githubID: card.githubID}, card, {new: true})
	.populate('lane sprint')
	.then(function(card) {
		res.send(card)
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
		return Card.findOne({ githubID: req.params.cardId })
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
		console.log("got in card srpint")
		return foundCard;
	})
	.then(function(foundCard){
		return Sprint.findById(req.params.sprintId)
		.then(function(foundSprint){
			console.log("got in foundsprint",foundSprint)
			foundCard.sprint=foundSprint;
			return foundCard.save()
		})
	})
	.then(function(savedCard){
		console.log("savedCard",savedCard)
		res.send(savedCard)
	})
})