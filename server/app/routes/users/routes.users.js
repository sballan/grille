'use strict';
const router = require('express').Router();
const mongoose = require('mongoose');
const controller = require('./users.controller');

module.exports = router

router.param('userId', function(req, res, next, id) {
  mongoose.model('User').findById(id)
  .then(function(user) {
    req.reqUser = user;
    next()
  })
  .catch(next)
})

router.get('/', controller.getAll);
router.get('/:userId', controller.getOne);




