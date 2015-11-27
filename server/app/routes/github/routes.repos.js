'use strict';
var router = require('express').Router();
var GitHubApi = require('github')
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')
var Board = require('mongoose').model('Board');
var Card = require('mongoose').model('Card');

module.exports = router;


router.get('/get/all', function(req, res, next) {
  var github = new GitHubApi({ debug: true, version: "3.0.0" } );

  github.authenticate({
      type: "oauth",
      token: req.user.accessToken
  });

  github.repos.getAll({per_page: 100}, function(err, data) {
    if(err) console.error(err)

     data = data.map(function(repo) {
      return payloadParser.repo(repo)
    })

    Promise.map(data, function(board) {
      console.log("Finding the Board, it is: ", board)
      return Board.findOne({githubID: board.githubID})
    })
    .then(function(boards) {
      console.log("Found the Boards, they are: ", boards)
      return Promise.map(boards, function(board, index) {
        if(!board) board = {githubID: null}
        return Board.findOneAndUpdate({ githubID: board.githubID}, data[index], {upsert: true, new: true})
      })
    })
    .then(function(boards) {
      console.log("Updated Boards", boards)
      res.send(boards)
    })

  })

});



router.get('/get/:repo', function(req, res, next) {
	var github = new GitHubApi({ debug: true, version: "3.0.0" } );

	github.authenticate({
			type: "oauth",
			token: req.user.accessToken
	});
	console.log("----req user", req.user)

  //TODO - get and update repo info

  Board.findOne({name: req.params.repo})
  .then(function (repo) {
    //get repo issues
    github.issues.repoIssues({user: repo.owner.username, repo: req.params.repo, per_page: 100, state: "all"}, 
        function(err, issues) {
          if(err) {
            console.error(err)
          }

          //console.log('ISSUE DATA - ', issues);
          //save all issues

          var promise_arr = [];
          issues.forEach(function(issue) {
            var parsed_issue = payloadParser.issue(issue);
            console.log('ISSUE - ', parsed_issue);
            // You might get weird async issues if you do it this way.  For instance, if the returned array somehow has the same card twice.
            // This is partially why we did a .find() once before we did a .findOneAndUpdate for the getAll function.
            promise_arr.push(Card.findOneAndUpdate({ githubID: parsed_issue.githubID}, parsed_issue, {upsert: true, new: true}));
          })

          return Promise.all(promise_arr);   
    })
  })
  .then(function(data) {
    console.log("Updated Issues", data);
    res.send(data);
  })
  .then(null, function(err) {
    console.log("ERROR - ", err);
    res.send(err);
  });

});


router.put('/put/:boardID/active', function(req,res,next){
	var github = new GitHubApi({ debug: true, version: "3.0.0" } );

	github.authenticate({
			type: "oauth",
			token: req.user.accessToken
	});

	Board.findOneAndUpdate({ githubID: req.params.boardID}, { isActive: true}, {new : true})
	.then(function(board){
		console.log("board updated:", board)
		res.send(board)
	})

})
