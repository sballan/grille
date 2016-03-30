'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../middleware/github-griller');

module.exports = router

router.param('repoId', function(req, res, next, id) {
  req.griller = new Griller(req, res, next);
  return req.griller.attach('Repo', id)
    .then(function() {
      console.log(`Repo ${req.repo.name} was attached.`)
      next()
    })
});

router.get('/', function(req, res, next) {
  return new Griller(req, res, next).getAllRepos()
  .then(function(repos) {
    console.log(repos[0].owner)
    res.send(repos)
  })
  .catch(next)
});

router.get('/:repoId', function(req, res, next) {
  req.griller.getOneRepo()
      .then(function(repo) {
        if(repo) res.json(repo);
        else res.sendStatus(404);
      });
});

router.get('/:repoId/fullView', function(req, res, next) {
  req.griller.fullView = true;
  req.griller.getOneRepo()
    .then(function(repo) {
      console.log("FOUND THE REPO", repo);
      console.log("ISSUE", repo.issues[0]);
      if(repo) res.send(repo);
      else res.sendStatus(404);
    })
});

router.put('/:repoId', function(req, res, next) {
  req.repo.set(req.body);
  req.repo.save()
  .then(function(repo) {
    res.json(repo)
  })
  .then(null, next)

});


