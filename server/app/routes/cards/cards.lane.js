//'use strict';
//var router = require('express').Router();
//var payloadParser = require('../../github-data/parsers')
//var Promise = require('bluebird')
//
//var Issue = require('mongoose').model('Issue');
//var Lane = require('mongoose').model('Lane');
//
//module.exports = router;
//
//router.put('/many', function(req, res, next) {
//
//	var card = req.body
//
//	Promise.map(card, function(card) {
//		return Issue.findOneAndUpdate({githubId: card.githubId}, card, {new: true})
//	})
//	.then(function(card) {
//		res.send(card)
//	})
//
//})
//
//router.put('/:cardID', function(req, res, next) {
//
//	var card = req.body
//	Issue.findOneAndUpdate({githubId: card.githubId}, card, {new: true})
//	.populate('lane sprint')
//	.then(function(card) {
//		res.send(card)
//	})
//
//})
