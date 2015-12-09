var router = require('express').Router();
var Card = require('mongoose').model('Card');
var User = require('mongoose').model('User');
var Board = require('mongoose').model('Board');
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

	Board.findById(req.body.card.board)
	.then(function(board){
		//Send the comment to Github with msg body
		msg.repo = board.name
		msg.user = board.owner.username
		var createCommentAsync = Promise.promisify(github.issues.createComment);
		return createCommentAsync(msg)
	})
	.then(function(comment){
		newComment = payloadParser.comment(comment)

		//find the Card the comment was on, so we can update the card in the Database
		return Card.findOne({ githubID: req.params.cardID})
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
		id: req.body.comment.githubID,
		body: req.body.comment.body
	}
	Board.findById(req.body.card.board)
	.then(function(board){
		//Send the comment to Github with msg body
		msg.repo = board.name
		msg.user = board.owner.username
		return editCommentAsync(msg)
	})
	.then(function(response){
		//find the Card the comment was on, so we can update the card in the Database
		return Card.findOne({ githubID: req.params.cardID})
	})
	.then(function(card){
		card.comments.forEach(function(comment){
			if (comment.githubID == req.body.comment.githubID){
				comment.body = req.body.comment.body;
				comment.user.username = req.body.comment.user.username
				comment.save()
			}
		})

		res.send(card)
	})
})

router.delete('/:cardID/:boardID/:commentID', function(req,res,next){
	var github = req.user.githubAccess;
	var deleteCommentAsync = Promise.promisify(github.issues.deleteComment);
	var msg = {
		user: null,
		repo: null,
		id: req.params.commentID
	}
	Board.findById(req.params.boardID)
	.then(function(board){
		//Send the comment to Github with msg body
		msg.repo = board.name
		msg.user = board.owner.username
		return deleteCommentAsync(msg)
	})
	.then(function(response){
		//find the Card the comment was on, so we can delete the comment
		return Card.findOne({ githubID: req.params.cardID})
	})
	.then(function(card){
		card.comments.forEach(function(comment, idx){
			if (comment.githubID == req.params.commentID){
				card.comments.splice(idx,1)
			}
		})
		res.send(card.comments)
	})
})