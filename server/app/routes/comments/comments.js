var router = require('express').Router();
var Issue = require('mongoose').model('Issue');
var User = require('mongoose').model('User');
var Repo = require('mongoose').model('Repo');
var Promise = require('bluebird')
var GitHubApi = require('github')
var payloadParser = require('../../github-data/parsers')

module.exports = router;
//Create a Comment
router.post('/:cardID', function(req,res,next){
	var newComment;
	var github = req.user.githubAccess;

	//body of a request we'll send to Github
	var msg = {
		user: null,
		repo: null,
		number: req.body.card.issueNumber,
		body: req.body.comment.body
	}

	Repo.findById(req.body.card.repo)
	.then(function(repo){
		//Send the comment to Github with msg body
		msg.repo = repo.name
		msg.user = repo.owner.username
		var createCommentAsync = Promise.promisify(github.issues.createComment);
		return createCommentAsync(msg)
	})
	.then(function(comment){
		newComment = payloadParser.comment(comment)

		//find the Issue the comment was on, so we can update the card in the Database
		return Issue.findOne({ githubId: req.params.cardID})
	})
	.then(function(card){
		//Add the new comment to the Database
		card.comments.push(newComment)
		return card.save()
	})
	.then(function(card){
		res.send(card)
	})

})
//Update a Comment
router.put('/:cardID', function(req,res,next){
	var github = req.user.githubAccess;
	var editCommentAsync = Promise.promisify(github.issues.editComment);
	//body of a request we'll send to Github
	var msg = {
		user: null,
		repo: null,
		id: req.body.comment.githubId,
		body: req.body.comment.body
	}
	Repo.findById(req.body.card.repo)
	.then(function(repo){
		//Send the comment to Github with msg body
		msg.repo = repo.name
		msg.user = repo.owner.username
		return editCommentAsync(msg)
	})
	.then(function(response){
		//find the Issue the comment was on, so we can update the card in the Database
		return Issue.findOne({ githubId: req.params.cardID})
	})
	.then(function(card){
		card.comments.forEach(function(comment){
			if (comment.githubId == req.body.comment.githubId){
				comment.body = req.body.comment.body;
				comment.user.username = req.body.comment.user.username
				comment.save()
			}
		})

		res.send(card)
	})
})

router.delete('/:cardID/:repoID/:commentID', function(req,res,next){
	var github = req.user.githubAccess;
	var deleteCommentAsync = Promise.promisify(github.issues.deleteComment);
	var msg = {
		user: null,
		repo: null,
		id: req.params.commentID
	}
	Repo.findById(req.params.repoID)
	.then(function(repo){
		//Send the comment to Github with msg body
		msg.repo = repo.name
		msg.user = repo.owner.username
		return deleteCommentAsync(msg)
	})
	.then(function(response){
		//find the Issue the comment was on, so we can delete the comment
		return Issue.findOne({ githubId: req.params.cardID})
	})
	.then(function(card){
		card.comments.forEach(function(comment, idx){
			if (comment.githubId == req.params.commentID){
				card.comments.splice(idx,1)
			}
		})
		res.send(card.comments)
	})
})
