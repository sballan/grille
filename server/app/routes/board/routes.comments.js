var router = require('express').Router();
var Card = require('mongoose').model('Card');
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

	//var createCommentAsync = Promise.promisify(github.issues.createComment);

	// createCommentAsync({ 
	// 	user: req.user
	// 	repo: req.body.card.githubID
	// 	number: req.params.cardID,
	// 	body: req.body.body
	// })

	//2 persist comment to our DB
	console.log("~~~ROUTER , reqbody:", req.body)

	Card.findOne({ githubID: req.params.cardID})
	.then(function(card){
		console.log("~~~ROUTER , reqbody postCardFindOne is:", req.body)

		var newComment = new Comment({ body: req.body.comment.body, author: req.user })

		card.comments.push(newComment)
		card.save()
		console.log("~~~ROUTER newly updated card:", card)
		res.send(card)
	})
	// .then(function())
})