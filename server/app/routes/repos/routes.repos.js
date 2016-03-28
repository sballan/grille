'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../middleware/github-griller');

module.exports = router

router.param('repoId', function(req, res, next, id) {
  req.griller = new Griller(req, res, next);
  req.griller.getOneRepo(id);
  return req.griller;
})

router.get('/', function(req, res, next) {
  return new Griller(req, res, next).getAllRepos()
  .then(function(repos) {
    console.log('repo1', repos[0].owner)
    res.send(repos)
  })
  .catch(next)
});

router.get('/:repoId', function(req, res, next) {
  res.json(req.repo)
  
	// return new Griller(req, res, next).getOneRepo()
  // .then(function(repo) {
	// 	console.log("------REPO", repo)
  //   res.send(repo)
  // }, function(err) {
	// 	console.error(chalk.red("Failed to get repo" + err))
	// 	res.send(500);
	// })

})

router.put('/:repoId', function(req, res, next) {
  req.repo.update(req.body)
  .then(function(repo) {
    res.json(repo)
  })
  .catch(next)

})


