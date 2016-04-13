'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../modules/griller');

module.exports = router;

router.param('issueId', function(req, res, next, id) {
  req.griller = req.griller || new Griller(req);
  if(!req.griller.repo) res.sendStatus(404);

  return req.griller.attach('Issue',  {_id: id}, 'owner')
    .then(function(issue) {
      console.log(`Issue #${issue.issueNumber} was attached..`);
      next()
    })
    .catch(next)
});

router.get('/', function(req, res, next) {
  req.griller = req.griller || new Griller(req);
  if(!req.griller.repo) res.sendStatus(404);
  console.log("made it to get All Issues")

  return req.griller.getAllIssues()
  .then(function(issues) {
    res.send(issues)
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



