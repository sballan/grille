var router = require('express').Router();
var Card = require('mongoose').model('Card');
var User = require('mongoose').model('User');
var Board = require('mongoose').model('Board');
var Comment = require('mongoose').model('Comment');
var Promise = require('bluebird')
var GitHubApi = require('github')

module.exports = router;

router.post('/post/:cardID', function(req,res,next){
	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});

	
	var msg = {
		user: null,
		repo: null,
		number: req.body.card.issueNumber,
		body: req.body.comment.body
	}

	Board.findById(req.body.card.board)
	.then(function(board){
		msg.repo = board.name
		msg.user = board.owner.username
		var createCommentAsync = Promise.promisify(github.issues.createComment);
		console.log("msg:", msg)
		return createCommentAsync(msg)
	})
	.then(function(response){
		//parse the response...
		console.log("responded~~~~~~~~~")
		res.send(response)
		//create new comment...
	})
	// .catch(console.log)

	//console.log
	//2 persist comment to our DB
	// console.log("~~~ROUTER , reqbody:", req.body)
	// Card.findOne({ githubID: req.params.cardID})
	// .then(function(card){
	// 	var newComment = new Comment({ body: req.body.comment.body, author: req.user })
	// 	card.comments.push(newComment)
	// 	card.save()
	// 	console.log("~~~ROUTER newly updated card:", card)
	// 	res.send(card)
	// })
})