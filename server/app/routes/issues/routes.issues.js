'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../modules/griller');

module.exports = router

router.param('issueId', function(req, res, next, id) {
  req.griller = new Griller(req, res, next);
  return req.griller.attach('Issue', id)
    .then(function() {
      console.log(`Issue #${req.theIssue.issueNumber} was attached.`)
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
  req.griller.getOneIssue()
      .then(function(issue) {
        if(issue) res.json(issue);
        else res.sendStatus(404);
      });
});



