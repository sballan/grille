'use strict';
const router = require('express').Router();
const Promise = require('bluebird');/**/
const controller = require('./issues.controller');
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

router.get('/', controller.getAll);

router.get('/:issueId', controller.getOne);




