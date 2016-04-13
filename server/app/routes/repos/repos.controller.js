"use strict";
const Griller = require('../../../modules/griller');

const getAll = function(req, res, next) {
  req.griller = req.griller || new Griller(req);

  return req.griller.getAllRepos()
    .then(function(repos) {
      console.log(repos[0].owner);
      res.send(repos)
    })
    .catch(next)
};

const getOne = function(req, res, next) {
  req.griller = req.griller || new Griller(req);

  req.griller.getOneRepo()
    .then(function(repo) {
      if(repo) res.json(repo);
      else res.sendStatus(404);
    })
    .catch(next);
};

const getOneFullView = function(req, res, next) {
  req.griller = req.griller || new Griller(req);

  req.griller.getFull = true;
  return getOne(req, res, next)
};

const updateOne = function(req, res, next) {
  console.log("got to update one")
  req.griller.repo.set(req.body);
  req.griller.repo.save()
    .then(function(repo) {
      res.json(repo);
      console.log("after res.json")
    })
    .catch(next)

};


module.exports = {
  getAll,
  getOne,
  getOneFullView,
  updateOne
};
