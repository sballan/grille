'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

module.exports = router;

router.get('/:repo', function(req, res, next) {
	// This is done to let us factor out functions that can refer to the response
	var theRepo;
	var theLane;
	var theLanes;
	var hasNextPage;

	var github = req.user.githubAccess;

	var getCommentsAsync =  Promise.promisify(github.issues.getComments)
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
				repo: theRepo.name,
				per_page: 100,
				page: currentPage,
				state: "all"
			})

		.then(function(issues) {
				hasNextPage = github.hasNextPage(issues.meta.link)

				issues = theIssues.concat(issues)

				if(hasNextPage) {
					return makeIssues(repo, currentPage + 1, issues);
				}

			return Promise.map(issues, function(issue) {
				var parsed_issue = payloadParser.issue(issue);
				parsed_issue.board = theRepo._id

				return Card.findOne({ githubID: parsed_issue.githubID })
				.then(function(card) {
					if(!card) {
						parsed_issue.lane = theLane._id

						return Card.create(parsed_issue)
					} else {
						return card.set(parsed_issue).save()
					}
				})
			})
			.then(attachComments)
			.then(sendData)
			.then(null, next);

		})
		.then(null, next)
	}

	function attachComments(issues) {
		return Promise.map(issues, function(issue) {
			return getCommentsAsync({user: theRepo.owner.username, repo: theRepo.name, number: issue.issueNumber, per_page: 100})
			.then(function(comments) {
				comments.forEach(function(comment) {
					comment = payloadParser.comment(comment)
					if(!comment.githubID) comment = undefined
				})


				comments = comments.filter(function(comment) {
					return !!comment
				})

				return Card.findOneAndUpdate({githubID: issue.githubID}, {comments: comments}, {new: true, upsert: true})
				.populate('comments lane')
			})
		})
		.then(null, next)
	}

	//OP: res is global, not good
	function sendData(cards) {
		var theData = {
			board: theRepo,
			cards: cards,
			lanes: theLanes
		}
		res.send(theData);
	}

})
