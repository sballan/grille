'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var GitHubApi = require('github')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

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