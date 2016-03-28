const Promise = require('bluebird');
const mongoose = require('mongoose');

const getAll = function(req, res, next) {
  return mongoose.model('User').find({})
  .then(function(users) {
    res.json(users);
  })
}

const getOne = function(req, res, next) {
  res.json(req.reqUser);
}

module.exports = {
  getAll,
  getOne
}