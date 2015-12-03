var router = require('express').Router();
var Card = require('mongoose').model('Card');
var User = require('mongoose').model('User');
var Comment = require('mongoose').model('Comment');
var Promise = require('bluebird')
var GitHubApi = require('github')

module.exports = router;

router.post('/post/:cardID', function(req,res,next){
	//1 tell Github that we added a comment
	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});

	var createCommentAsync = Promise.promisify(github.issues.createComment);
	console.log("~~~ROUTER, req.body.card", req.body.card)
	/*
	var msg = {
		user: req.user, //need user name str
		repo: req.body.card.githubID, //repo name str
		number: req.params.cardID,
		body: req.body.comment.body
	}

	User.findOne({ githubID: req.user})
	.then(function(user){
		msg.user = user.username
		// return Board.findOne({ githubID: req.body.card.board })
	
	})

	createCommentAsync(msg)
	.then(function(response){
		//parse it
		//create new Comment({})
	})
	*/
	//2 persist comment to our DB
	console.log("~~~ROUTER , reqbody:", req.body)
	Card.findOne({ githubID: req.params.cardID})
	.then(function(card){
		var newComment = new Comment({ body: req.body.comment.body, author: req.user })
		card.comments.push(newComment)
		card.save()
		console.log("~~~ROUTER newly updated card:", card)
		res.send(card)
	})
})