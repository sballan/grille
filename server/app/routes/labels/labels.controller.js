'use strict';
const Griller = require('../../../modules/griller');

const getAllRepoLabels = function(req, res, next) {
  if(!req.griller || !req.griller.repo) res.sendStatus(404);
  console.log("getAllRepoLabels")
  return req.griller.repo.getAllLabels()
    .then(labels=> res.json(labels))
    .catch(next)
};

const getAllIssueLabels = function(req, res, next) {
  if(!req.griller || !req.griller.issue) res.sendStatus(404);

  return req.griller.issue.deepPopulate('labels')
    .then(labels=> res.json(labels))
    .catch(next)
};

const getAll = function(req, res, next) {
  console.log("got to get All")
  req.griller = req.griller || new Griller(req);
  if(!req.griller.repo) res.sendStatus(404);

  if(req.griller._getRepoLabels) {
    delete req.griller._getRepoLabels;
    return getAllRepoLabels(req, res, next);
  }

  return getAllIssueLabels(req, res, next);

};



module.exports = {
  getAll
};
