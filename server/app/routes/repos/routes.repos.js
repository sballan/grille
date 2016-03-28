'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../middleware/github-griller');

module.exports = router

router.get('/', function(req, res, next) {
  return new Griller(req, res, next).getAllRepos()
  .then(function(repos) {
    console.log('repo1', repos[0].owner)
    res.send(repos)
  })
  .catch(next)
});

router.get('/:repo', function(req, res, next) {
	console.log("made it to route")
	return new Griller(req, res, next).getOneRepo()
  .then(function(repo) {
		console.log("------REPO", repo)
    res.send(repo)
  }, function(err) {
		console.error(chalk.red("Failed to get repo" + err))
		res.send(500);
	})

})

router.put('/:repo/active', function(req, res, next) {
	var github = req.user.githubAccess;

	Repo.findOneAndUpdate({ githubId: req.params.repo}, { isActive: true}, {new : true})
	.then(function(repo){
		res.send(repo)
	})

})


