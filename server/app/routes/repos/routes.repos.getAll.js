'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const Griller = require('../../../middleware/github-griller');

const Repo = require('mongoose').model('Repo');

module.exports = router;
///* For Testing purposes
router.get('/', function(req, res, next) {
  return new Griller(req, res, next).getAllRepos()
  .then(function(repos) {
    res.send(repos)
  })
  .catch(next)
});
