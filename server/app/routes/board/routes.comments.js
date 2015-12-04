var router = require('express').Router();
var Card = require('mongoose').model('Card');
var User = require('mongoose').model('User');
var Board = require('mongoose').model('Board');
var Comment = require('mongoose').model('Comment');
var Promise = require('bluebird')
var GitHubApi = require('github')

module.exports = router;

router.post('/:cardID', function(req,res,next){
	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});

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
	.then(function(response){
		//find the Card the comment was on, so we can update the card in the Database
		return Card.findOne({ githubID: req.params.cardID})
	})
	.then(function(card){

		//Add the new comment to the Database
		var newComment = new Comment({ body: msg.body, author: req.user })
		card.comments.push(newComment)
		card.save()
		res.send(card) 
	})

})

router.put('/:cardID', function(req,res,next){
	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});	

	//body of a request we'll send to Github

	var msg = {
		user: null,
		repo: null,
		id: req.body.card.issueNumber,
		body: req.body.comment.body
	}

	Board.findById(req.body.card.board)
	.then(function(board){
		//Send the comment to Github with msg body
		msg.repo = board.name
		msg.user = board.owner.username
		var editCommentAsync = Promise.promisify(github.issues.editComment);
		console.log("~~~msg~~~", msg)
		return editCommentAsync(msg)
	})
	.then(function(response){
		//find the Card the comment was on, so we can update the card in the Database
		console.log("RESPONSE:", response)
		return Card.findOne({ githubID: req.params.cardID})
	})
	.then(function(card){

		card.comments.forEach(function(comment){
			if (comment.githubID == req.body.comment.githubID){
				comment.body = req.body.comment.body;
				comment.save()
			}
		})

		res.send(card)
	})
})