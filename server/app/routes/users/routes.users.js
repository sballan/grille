'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const mongoose = require('mongoose');
const Griller = require('../../../middleware/github-griller');
const usersController = require('./users.controller');

module.exports = router

router.param('userId', function(req, res, next, id) {
  Promise.resolve(mongoose.model('User').findById(id))
  .then(function(user) {
    req.reqUser = user;
    next()
  })
  .catch(next)
})

router.get('/', usersController.getAll);
router.get('/:userId', usersController.getOne);




