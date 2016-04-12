'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../modules/griller');

module.exports = router;

router.param('issueId', function(req, res, next, id) {
  req.griller = new Griller(req, res, next);
  return req.griller.attach('Repo', {issues: {$elemMatch: {_id: id}}}, 'owner')
    .then(function(g) {
      console.log(`Repo ${g.repo.name} was attached; about to get Issue.`);
      next()
    })
});

router.get('/', function(req, res, next) {
  return new Griller(req, res, next).getAllIssues()
  .then(function(issues) {
    res.send(repos)
  })
  .catch(next)
});

router.get('/:issueId', function(req, res, next) {
  req.griller.getOneIssue(null, req.params.issueId)
      .then(function(issue) {
        if(issue) res.json(issue);
        else res.sendStatus(404);
      });
});



