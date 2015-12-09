'use strict';
var router = require('express').Router();
var payloadParser = require('../../github-data/parsers')
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

	var getCommentsAsync =  Promise.promisify(github.issues.getComments)
	var repoIssuesAsync = Promise.promisify(github.issues.repoIssues)
	var getCollaboratorsAsync = Promise.promisify(github.repos.getCollaborators)
	var getIssueLabelsAsync = Promise.promisify(github.issues.getIssueLabels)


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
						var parsed_issue = payloadParser.issue(issue);
						parsed_issue.board = theRepo._id

						var issueLabels;

						return Card.findOne({ githubID: parsed_issue.githubID })
							.then(function(card) {
								return getIssueLabelsAsync({
									user: repo.owner.username,
									repo: repo.name,
									number: issue.number,
								})
								.then(function(labels) {
									return Promise.map(labels, function(label) {
										return Label.findOneAndUpdate({board: theRepo._id, name: label.name}, label, {new: true, upsert: true})
									})
									.then(function(newLabels) {
										parsed_issue.labels = newLabels
										return card
									})
								})
							})
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
					.then(getCollaborators)
					.then(sendData)
					.then(null, next)
				}
		})
		.then(null, next)
	}

	function attachComments(issues) {
		return Promise.map(issues, function(issue) {
			return getCommentsAsync({user: theRepo.owner.username, repo: theRepo.name, number: issue.issueNumber, per_page: 100})
			.then(function(comments) {
				comments = comments.map(function(comment) {
					comment = payloadParser.comment(comment)
					if(comment) return comment
				})
				return Card.findOneAndUpdate({githubID: issue.githubID}, {comments: comments}, {new: true, upsert: true})
				.populate('comments lane sprint')
			})
		})
		.then(null, next)
	}

	function getCollaborators(cards) {
		theCards = cards;
		return getCollaboratorsAsync(
			{
				user: theRepo.owner.username,
				repo: theRepo.name,
				per_page: 100
			})
			.then(function(collaborators) {
				collaborators = collaborators.map(function(collaborator) {
					collaborator = payloadParser.collaborator(collaborator)
					if(typeof collaborator.githubID === 'string') return collaborator
				})

				return Promise.map(collaborators, function(collaborator) {
					return User.findOneAndUpdate({githubID: collaborator.githubID}, collaborator, {upsert: true, new: true}).select('-accessToken')
				})
			})
			.then(function(collaborators) {
				theRepo.set({collaborators: collaborators}).populate('collaborators')
				return theRepo.save()
			})
	}

	//OP: res is global, not good
	function sendData(theBoard) {
		var attachedLabels;
		var theBoard = theBoard;

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
