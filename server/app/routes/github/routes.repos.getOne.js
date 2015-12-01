'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')

var GitHubApi = require('github')

var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');
var Lane = require('mongoose').model('Lane');

module.exports = router;

router.get('/:repo', function(req, res, next) {
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
	var theLanes;

	var hasNextPage;

	var getCommentsAsync = Promise.promisify(github.issues.getComments)
	var repoIssuesAsync = Promise.promisify(github.issues.repoIssues)

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
				// if (err) console.error(err)

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
					if(!card) parsed_issue.lane = theLane._id
					card.update(
						{ githubID: parsed_issue.githubID },
						parsed_issue,
						{ upsert: true })
				})
			})
			.then(function(boardIssues) {
				//console.log("Board issues:", boardIssues)
				return Promise.map(boardIssues, function(issue) {
					return getCommentsAsync({user: theRepo.owner.username, repo: theRepo.name, number: issue.issueNumber, per_page: 100})
					.then(function(comments) {
						comments.forEach(function(comment) {
							comment = payloadParser.comment(comment) || undefined
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
				console.log("FINISHED", sendData);
				res.send(sendData);
			})
			.then(null, function(err) {
				console.log("ERROR - ", err);
				res.status(404).send(err);
			});

		})
	}

	Board.findOne({ githubID: req.params.repo })
		.then(function(repo) {
			theRepo = repo
			return Lane.find({board: repo})
		})
		.then(function(lanes) {
			return lanes.forEach(function(lane) {
				if(lane.title === 'Backlog') return lane
			})
			console.error("Error creating lane, backlog lane not found")
		})
		.then(function(lane){
			theLane = lane;
			makeIssues(theRepo, 1, [])
		})

});
