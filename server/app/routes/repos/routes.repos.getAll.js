'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers');
var Promise = require('bluebird');
var griller = require('../../../middleware/github-griller');

var Board = require('mongoose').model('Board');

module.exports = router;

// For Testing purposes
router.get('/', function(req, res, next) {
  console.log('req.body', req.body)
  return new griller(req).getAllRepos()
  .then(function(repos) {
    console.log('------length', repos.length)
    res.send(repos)
    //console.log("here are the repos", repos)
  })

});

//router.get('/', function(req, res, next) {
//
//	var response;
//
//	var github = req.user.githubAccess;
//
//	var getAllAsync = Promise.promisify(github.repos.getAll)
//
//	// This function is called recursively, to get all the pages of repos
//	getPages(1, [])
//
//	function getPages(currentPage, theData) {
//		// returns all 100 repos from the currentPage
//		return getAllAsync({ per_page: 100, page: currentPage, sort: 'updated' })
//		.then(function(data) {
//
//			var hasNextPage = github.hasNextPage(data.meta.link)
//
//			// Here the list of repos is concatenated with the list from the previous recursion
//			data = theData.concat(data)
//
//			if(hasNextPage) {
//				getPages(currentPage + 1, data)
//			} else {
//
//				data = data.map(function(repo) {
//					return payloadParser.repo(repo)
//				})
//
//				// This puts all the boards from our database that correspond to the github repos in an array
//				return Promise.map(data, function(board) {
//
//					return Board.findOne({
//						githubID: board.githubID
//					})
//				})
//				.then(dataUpsert)
//			}
//
//			function dataUpsert(boards) {
//				Promise.map(boards, function(board, index) {
//					if (!board) board = { githubID: null }
//
//					return Board.findOneAndUpdate({
//						githubID: board.githubID
//					}, data[index], {
//						upsert: true,
//						new: true
//					})
//				})
//				.then(function(boards) {
//					res.send(boards)
//				})
//			}
//
//		})
//	}
//
//})

