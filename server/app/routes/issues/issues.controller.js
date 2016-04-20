'use strict';
const Griller = require('../../../modules/griller');

const getAll = function(req, res, next) {
  req.griller = req.griller || new Griller(req);
  if(!req.griller.repo) res.sendStatus(404);
  console.log("made it to get All Issues");

  return req.griller.getAllIssues()
    .then(function(issues) {
      if(issues) res.json(issues);
      else res.sendStatus(404);
    })
    .catch(next)
};

const getOne = function(req, res, next) {
  req.griller.getOneIssue(null, req.params.issueId)
    .then(function(issue) {
      if(issue) res.json(issue);
      else res.sendStatus(404);
    });
};

module.exports = {
  getAll,
  getOne
};


