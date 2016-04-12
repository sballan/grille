'use strict';
const Promise = require('bluebird');
const mongoose = require('mongoose');

const getAll = function(req, res, next) {
  return mongoose.model('User').find({})
  .then(function(users) {
    res.json(users);
  })
  .catch(next)
};

const getOne = function(req, res, next) {
  res.json(req.g.user);
};

module.exports = {
  getAll,
  getOne
};
