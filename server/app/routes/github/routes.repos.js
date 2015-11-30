'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var GitHubApi = require('github')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');

module.exports = router;

// TODO Save owners and collaborators
router.get('/get/all', function(req, res, next) {

	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});


	function getPages(currentPage, theData) {

		return github.repos.getAll({ per_page: 100, page: currentPage, sort: 'updated'	}, function(err, data) {
		if (err) console.error(err)
			var hasNextPage = github.hasNextPage(data.meta.link)

		data = theData.concat(data)

			if(hasNextPage) {
				return getPages(currentPage + 1, data)
			}

			data = data.map(function(repo) {
				return payloadParser.repo(repo)
			})

			if(!hasNextPage) {
				Promise.map(data, function(board) {
					return Board.findOne({
						githubID: board.githubID
					})
				})
				.then(function(boards) {
					return Promise.map(boards, function(board, index) {
						if (!board) board = { githubID: null }
						return Board.findOneAndUpdate({
							githubID: board.githubID
						}, data[index], {
							upsert: true,
							new: true
						})
					})
				})
				.then(function(boards) {
					console.log("Updated Boards", boards)
					res.send(boards)
				})
			}
		})
	}
	// The function calls itself recursively to get data from each of the pages received from github
	getPages(1, [])

	})

router.get('/get/:repo', function(req, res, next) {
	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});
	//console.log("----req user", req.user)
	var theRepo;
	var theLane;

	Board.findOne({
			githubId: req.params.repo
		})
		.then(function(repo) {
			theRepo = repo
			return Lane.findOne({board: repo._id, title: 'Backlog'})
		})
		.then(function(lane){
			theLane = lane;
			makeIssues(repo, 1, [])
		})

	function makeIssues(repo, currentPage, theIssues) {
		//get repo issues
		return github.issues.repoIssues({
				user: repo.owner.username,
				repo: req.params.repo,
				per_page: 100,
				state: "all"
			},
			function(err, issues) {
				if (err) console.error(err)

				var hasNextPage = github.hasNextPage(issues.meta.link)

				issues = theIssues.concat(issues)

				if(hasNextPage) {
					return makeIssues(repo, currentPage + 1, issues)
				}


				var promise_arr = [];
				issues.forEach(function(issue) {
					var parsed_issue = payloadParser.issue(issue);
					parsed_issue.lane = theLane._id
					parsed_issue.board = theRepo._id

					console.log('ISSUE - ', parsed_issue);
					promise_arr.push(Card.findOneAndUpdate({
						githubID: parsed_issue.githubID
					}, parsed_issue, {
						upsert: true,
						new: true
					}));
				})

				Promise.all(promise_arr)
				.then(function(data) {
					console.log("Updated Issues", data);
					res.send(data);
				})
				.then(null, function(err) {
					console.log("ERROR - ", err);
					res.send(err);
				});

			})
	}

});


router.put('/put/:boardID/active', function(req, res, next) {
	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});


	Board.findOneAndUpdate({ githubID: req.params.boardID}, { isActive: true}, {new : true})
	.then(function(board){
		console.log("board updated:", board)
		res.send(board)
	})

})
