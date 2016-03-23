'use strict';
const router = require('express').Router();
const Griller = require('../../../middleware/github-griller');
const Promise = require('bluebird')


module.exports = router;



router.get('/:repo', function(req, res, next) {
	return new Griller(req, res, next).getOneRepo()
  .then(function(repo) {
		console.log("------REPO", repo)
    res.send(repo)
  }, function(err) {
		console.log("ERROR", err)
	})

})


// router.get('/:repo', function(req, res, next) {
// 	// This is done to let us factor out functions that can refer to the response
// 	var theRepo;
// 	var theLane;
// 	var theLanes;
// 	var theCards;
// 	var hasNextPage;
//
// 	var github = req.user.githubAccess;
//
// 	var repoIssuesAsync = Promise.promisify(github.issues.repoIssues)
//
// 	Repo.findOne({ githubId: req.params.repo })
// 		.then(function(repo) {
// 			theRepo = repo
// 			return Lane.find({repo: repo})
// 		})
// 		.then(function(lanes) {
// 			theLanes = lanes
// 			lanes.forEach(function(lane) {
// 				if(lane.title === 'Backlog') {
// 					theLane = lane
// 				}
// 			})
// 			makeIssues(theRepo, 1, [])
//
// 		})
// 		.then(null, next)
//
// 	function makeIssues(repo, currentPage, theIssues) {
// 		//get repo issues
// 		return repoIssuesAsync(
// 		{
// 				user: repo.owner.username,
// 				repo: repo.name,
// 				per_page: 100,
// 				page: currentPage,
// 				state: "all"
// 			})
//
// 		.then(function(issues) {
// 				hasNextPage = github.hasNextPage(issues.meta.link)
//
// 				issues = theIssues.concat(issues)
//
// 				if(hasNextPage) {
// 					return makeIssues(repo, currentPage + 1, issues);
// 				} else {
//
// 					return Promise.map(issues, function(issue) {
// 						issue = payloadParser.issue(issue);
// 						issue.repo = theRepo._id
//
// 						var issueLabels;
//
// 							return asyncIssues.getIssueLabels(issue, repo, github)
// 							.then(function(labels) {
// 								issueLabels = labels
// 								return Issue.findOne({githubId: issue.githubId})
// 							})
// 							.then(function(card) {
//
// 								if(!card) {
// 									issue.lane = theLane._id
//
// 									return Issue.create(issue)
// 								} else {
// 									return card.set(issue).save()
// 								}
// 						})
// 					})
// 					.then(function(issues) {
// 						return Promise.map(issues, function(issue) {
// 							return asyncComments.getComments(issue, theRepo, github)
// 						})
// 					})
// 					.then(function(cards) {
// 						theCards = cards
//
// 						return asyncCollaborators.getCollaborators(theRepo, github)
// 						.then(function(collaborators) {
// 							theRepo.set({collaborators: collaborators}).populate('collaborators')
// 							return theRepo.save()
// 						})
// 					})
// 					.then(sendData)
// 					.then(null, next)
// 				}
// 		})
// 		.then(null, next)
// 	}
//
//
// 	//OP: res is global, not good
// 	function sendData(theRepo) {
// 		var attachedLabels;
// 		// var theRepo = theRepo;
//
// 		Label.find({repo: theRepo})
// 		.then(function(labels) {
// 			attachedLabels = labels
// 			return Sprint.find({repo: theRepo})
// 		})
// 		.then(function(sprints) {
// 			var theData = {
// 				repo: theRepo,
// 				cards: theCards,
// 				lanes: theLanes,
// 				labels: attachedLabels,
// 				sprints: sprints
// 			}
// 			res.send(theData);
//
// 		})
//
// 	}
//
// })
