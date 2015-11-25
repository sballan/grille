'use strict';
var router = require('express').Router();
var GitHubApi = require('github')
var payloadParser = require('../../github-data/parsers')
var Promise = require('bluebird')
var Board = require('mongoose').model('Board')
module.exports = router;


router.get('/repos/getAll', function(req, res, next) {
  var github = new GitHubApi({ debug: true, version: "3.0.0" } );

  github.authenticate({
      type: "oauth",
      token: req.user.accessToken
  });

  github.repos.getAll({}, function(err, data) {
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
        return Board.findOneAndUpdate({ githubID: board.githubID}, data[index], {upsert: true, new: true})
      })
    })
    .then(function(boards) {
      console.log("Updated Boards", boards)
      res.send(boards)
    })

  })


});