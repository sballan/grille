'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

module.exports = router;

router.put('/many', function(req, res, next) {

	var cards = req.body

	Promise.map(cards, function(card) {
		return Card.findOneAndUpdate({githubId: card.githubId}, card, {new: true})
	})
	.then(function(cards) {
		res.send(cards)
	})

})

router.put('/:cardID', function(req, res, next) {

	var card = req.body
	Card.findOneAndUpdate({githubId: card.githubId}, card, {new: true})
	.populate('lane sprint')
	.then(function(card) {
		res.send(card)
	})

})
