'use strict';
var router = require('express').Router();
var GitHubApi = require('github')
module.exports = router;

router.get('/repos/getAll', function(req, res, next) {

	var github = new GitHubApi({ debug: true, version: "3.0.0" } );


	github.authenticate({
      type: "oauth",
      token: req.user.accessToken
  });

  github.repos.getAllAsync({}, function(err, data) {
  		var parsedData = data.map(function(repo) {
  			return payloadParser.repo(repo)
  		})
			console.log(parsedData)
    	Board.find({githubID: parsedData[0].githubID})
    	.then(function(repo) {
    		return Board.update({_id: repo._id}, parsedData[0], {upsert: true})
    	})
    	.then(function(board) {
    		console.log('-----This is the board', board)
    	})

  })
  .then(function(board) {

  })
  next()

	// github.issues.createComment({
	// 	user: 'sballan',
	// 	repo: 'grille',
	// 	number: 5,
	// 	body: "YES MOTHERFUCKER"
	// },
	// 	function(err, data) {
	// 		console.log("err", err, "res", data)
	// 		res.send("<p>We Hit The Route</p>")
	// 	}
	// );


});