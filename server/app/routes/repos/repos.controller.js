const Promise = require('bluebird');
const Griller = require('../../../modules/griller');

const getAll = function(req, res, next) {
  return new Griller(req).getAllRepos()
    .then(function(repos) {
      console.log("about to print repos")
      console.log(repos[0].owner);
      res.send(repos)
    })
    .catch(next)
};

const getOne = function(req, res, next) {
  req.griller.getOneRepo()
    .then(function(repo) {
      if(repo) res.json(repo);
      else res.sendStatus(404);
    });
};

module.exports = {
  getAll,
  getOne
};
