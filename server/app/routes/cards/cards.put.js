'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

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
	.populate('lane')
	.then(function(card) {
		res.send(card)
	})

})

router.put('/title/:cardId', function(req, res, next){
	var github = req.user.githubAccess;
	//Github module has a method 'githubissues.edit', there is no 'issues.updateTitle'
	var updateTitleAsync = Promise.promisify(github.issues.edit)

	// console.log("ROUTERPARAM", req.params)
	// console.log("ROUTERBODY", req.body)

	//body of a request we'll send to Github
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
		console.log("ROUTER MSG", msg)
		var updateTitleAsync = Promise.promisify(github.issues.edit);
		return updateTitleAsync(msg)
	})
	.then(function(response){
		console.log("ROUTER RESPONSE", response)
		return Card.findOne({ githubID: req.params.cardId })
	})
	.then(function(foundCard){
			foundCard.title = req.body.title;
			console.log("ROUTER FOUND CARD", foundCard)
			return foundCard.save()
	})
	.then(function(savedCard){
		res.send(savedCard)
	})
})

router.put("/storyPoints/:cardId",function(req,res,next){
	console.log("storypoints to backend", req.body.storyPoints)
	Card.findById(req.params.cardId)
	.then(function(foundCard){
		console.log("FOUND CAERDD", foundCard)
		foundCard.storyPoints=req.body.storyPoints;
		return foundCard.save()
	})
	.then(function(savedCard){
		console.log("saved CAERDD", savedCard)
		res.send(savedCard);
	})
})