'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var asyncIssues = require('../../github-data/async-functions/github/github.issues')
var asyncComments = require('../../github-data/async-functions/github/github.comments')
var asyncCollaborators = require('../../github-data/async-functions/github/github.collaborators')
var Promise = require('bluebird')

var User = require('mongoose').model('User');
var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');
var Label = require('mongoose').model('Label');
var Sprint = require('mongoose').model('Sprint');

module.exports = router;

router.get('/:repo', function(req, res, next) {
	// This is done to let us factor out functions that can refer to the response
	var theRepo;
	var theLane;
	var theLanes;
	var theCards;
	var hasNextPage;

	var github = req.user.githubAccess;

	var repoIssuesAsync = Promise.promisify(github.issues.repoIssues)

	Board.findOne({ githubID: req.params.repo })
		.then(function(repo) {
			theRepo = repo
			return Lane.find({board: repo})
		})
		.then(function(lanes) {
			theLanes = lanes
			lanes.forEach(function(lane) {
				if(lane.title === 'Backlog') {
					theLane = lane
				}
			})
			makeIssues(theRepo, 1, [])

		})
		.then(null, next)

	function makeIssues(repo, currentPage, theIssues) {
		//get repo issues
		return repoIssuesAsync(
		{
				user: repo.owner.username,
				repo: repo.name,
				per_page: 100,
				page: currentPage,
				state: "all"
			})

		.then(function(issues) {
				hasNextPage = github.hasNextPage(issues.meta.link)

				issues = theIssues.concat(issues)

				if(hasNextPage) {
					return makeIssues(repo, currentPage + 1, issues);
				} else {

					return Promise.map(issues, function(issue) {
						issue = payloadParser.issue(issue);
						issue.board = theRepo._id

						var issueLabels;

							return asyncIssues.getIssueLabels(issue, repo, github)
							.then(function(labels) {
								issueLabels = labels
								return Card.findOne({githubID: issue.githubID})
							})
							.then(function(card) {

								if(!card) {
									issue.lane = theLane._id

									return Card.create(issue)
								} else {
									return card.set(issue).save()
								}
						})
					})
					.then(function(issues) {
						return Promise.map(issues, function(issue) {
							return asyncComments.getComments(issue, theRepo, github)
						})
					})
					.then(function(cards) {
						theCards = cards

						return asyncCollaborators.getCollaborators(theRepo, github)
						.then(function(collaborators) {
							theRepo.set({collaborators: collaborators}).populate('collaborators')
							return theRepo.save()
						})
					})
					.then(sendData)
					.then(null, next)
				}
		})
		.then(null, next)
	}


	//OP: res is global, not good
	function sendData(theBoard) {
		var attachedLabels;
		// var theBoard = theBoard;

		Label.find({board: theBoard})
		.then(function(labels) {
			attachedLabels = labels
			return Sprint.find({board: theBoard})
		})
		.then(function(sprints) {
			var theData = {
				board: theBoard,
				cards: theCards,
				lanes: theLanes,
				labels: attachedLabels,
				sprints: sprints
			}
			res.send(theData);

		})

	}

})
