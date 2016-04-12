'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../modules/griller');
const controller = require('./repos.controller');

module.exports = router;

router.param('repoId', function(req, res, next, id) {
  req.griller = req.griller || new Griller(req);
  return req.griller.attach('Repo', {_id: id}, 'owner')
    .then(function(g) {
      console.log(`Repo ${g.repo.name} was attached.`);
      next()
    })
});

router.get('/', controller.getAll);

router.get('/:repoId', controller.getOne);

router.get('/:repoId/fullView', function(req, res, next) {
  req.griller.getFull = true;
  req.griller.getOneRepo()
    .then(function(repo) {
      console.log("HEY WE DID IT")
      if(repo) res.send(repo);
      else res.sendStatus(404);
    })
});

router.put('/:repoId', function(req, res, next) {
  req.griller.repo.set(req.body);
  req.griller.repo.save()
  .then(function(repo) {
    res.json(repo)
  })
  .then(null, next)

});

router.use('/:repoId/issues', require('../issues'));


