'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')
var Griller = require('../../../middleware/github-griller');

var Board = require('mongoose').model('Board');

module.exports = router;


router.put('/:boardID/active', function(req, res, next) {
  return Griller(req).getOneRepo(req.params.boardID)
  .then(function(repo) {
    console.log('----------repo', repo)
    console.log("here is the req", req)
  })

});

//router.put('/:boardID/active', function(req, res, next) {
//	var github = req.user.githubAccess;
//
//	Board.findOneAndUpdate({ githubId: req.params.boardID}, { isActive: true}, {new : true})
//	.then(function(board){
//		res.send(board)
//	})
//
//})
