'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var GitHubApi = require('github')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

module.exports = router;

var github;
var getAllAsync;
var response;
var data;

router.get('/', function(req, res, next) {
	response = res;
	github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});

	getAllAsync = Promise.promisify(github.repos.getAll)

	// This function is called recursively, to get all the pages of repos
	getPages(1, [])

})

function getPages(currentPage, theData) {
	// returns all 100 repos from the currentPage
	return getAllAsync({ per_page: 100, page: currentPage, sort: 'updated' })
		.then(function(d) {
			data = d
			var hasNextPage = github.hasNextPage(data.meta.link)

			// Here the list of repos is concatenated with the list from the previous recursion
			data = theData.concat(data)

			if(hasNextPage) { return getPages(currentPage + 1, data) }

			data = data.map(function(repo) {
				return payloadParser.repo(repo)
			})

		// This puts all the boards from our database that correspond to the github repos in an array
			return Promise.map(data, function(board) {
				return Board.findOne({
					githubID: board.githubID
				})
			})
		})
		.then(dataUpsert)
		.then(function(boards) {
			response.send(boards)
		})
}

function dataUpsert(boards) {
	return Promise.map(boards, function(board, index) {
			if (!board) board = { githubID: null }
			return Board.findOneAndUpdate({
				githubID: board.githubID
			}, data[index], {
				upsert: true,
				new: true
			})
		})
}