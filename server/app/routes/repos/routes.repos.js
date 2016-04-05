'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../modules/griller');

module.exports = router

router.param('repoId', function(req, res, next, id) {
  req.griller = new Griller(req);
  return req.griller.attach('Repo', id)
    .then(function() {
      console.log(`Repo ${req.theRepo.name} was attached.`)
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
      if(repo) res.send(repo);
      else res.sendStatus(404);
    })
});

router.put('/:repoId', function(req, res, next) {
  req.theRepo.set(req.body);
  req.theRepo.save()
  .then(function(repo) {
    res.json(repo)
  })
  .then(null, next)

});


