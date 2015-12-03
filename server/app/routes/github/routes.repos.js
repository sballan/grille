'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var GitHubApi = require('github')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

module.exports = router;

router.get('/get/all', function(req, res, next) {
	var github = req.user.githubAccess;

	// This function is called recursively; theData is an array made up of all the repos from all the pages; it grows each time the function recurses (using tail recursion).
	function getPages(currentPage, theData) {
		var getAllAsync = Promise.promisify(github.repos.getAll)

		// returns all 100 repos from the currentPage
		return getAllAsync({ per_page: 100, page: currentPage, sort: 'updated'	})
		.then(function(data) {

		var hasNextPage = github.hasNextPage(data.meta.link)

		// Here the list of repos is concatenated with the list from the previous recursion
		data = theData.concat(data)

			if(hasNextPage) {
				return getPages(currentPage + 1, data)
			}

			data = data.map(function(repo) {
				return payloadParser.repo(repo)
			})

			if(!hasNextPage) {
				// This puts all the boards from our database that correspond to the github repos in an array
				Promise.map(data, function(board) {
					return Board.findOne({
						githubID: board.githubID
					})
				})
				.then(function(boards) {
					// returns an array of the boards after they have been updated with the data from the github repos. Any new repos will be inserted to the database and returned as new boards.
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
					res.send(boards)
				})
			}
		})
	}
	// The function calls itself recursively to get data from each of the pages received from github
	getPages(1, [])

	})

router.get('/get/:repo', function(req, res, next) {
	var github = req.user.githubAccess;

	var theRepo;
	var theLane;
	var theLanes;
	var theIssues;


	function makeIssues(repo, currentPage, theIssues) {
		//get repo issues
		return github.issues.repoIssues(
		{
				user: repo.owner.username,
				repo: theRepo.name,
				per_page: 100,
				page: currentPage,
				state: "all"
			},
			function(err, issues) {
				// if (err) console.error(err)

				var hasNextPage = github.hasNextPage(issues.meta.link)

				issues = theIssues.concat(issues)

				if(hasNextPage) {
					return makeIssues(repo, currentPage + 1, issues);
				}

				Promise.map(issues, function(issue) {
					var parsed_issue = payloadParser.issue(issue);
					parsed_issue.lane = theLane._id
					parsed_issue.board = theRepo._id

					return Card.findOneAndUpdate({
						githubID: parsed_issue.githubID
					}, parsed_issue, {
						upsert: true,
						new: true
					})
				})
				.then(function(boardIssues) {
					//console.log("Board issues:", boardIssues)
					theIssues = boardIssues;
					var getCommentsAsync = Promise.promisify(github.issues.getComments)
					return Promise.map(boardIssues, function(issue) {
						return getCommentsAsync({user: theRepo.owner.username, repo: theRepo.name, number: issue.issueNumber, per_page: 100})
						.then(function(comments) {
							comments.forEach(function(comment) {
								comment = payloadParser.comment(comment)
								if(!comment.githubID) comment = undefined
							})
							//console.log("All the comments", comments)
							return Card.findOneAndUpdate({githubID: issue.githubID}, {comments: comments}, {new: true, upsert: true})
							.populate('comments lane')
						})
					})
				})
				.then(function(cards) {
					var sendData = {
						board: theRepo,
						cards: cards,
						lanes: theLanes
					}
					res.send(sendData);
				})
				.then(null, function(err) {
					console.log("ERROR - ", err);
					res.status(404).send(err);
				});

			})
	}

	Board.findOne({
			githubID: req.params.repo
		})
		.then(function(repo) {
			theRepo = repo
			return Lane.find({board: repo})
		})
		.then(function(lanes) {
			theLanes = lanes
			return Lane.findOne({board: theRepo, title: 'Backlog'})
		})
		.then(function(lane){
			theLane = lane;
			makeIssues(theRepo, 1, [])
		})

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
		//  console.info("board updated:", board)
		res.send(board)
	})

})
