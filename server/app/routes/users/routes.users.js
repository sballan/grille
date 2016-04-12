'use strict';
const router = require('express').Router();
const Griller = require('../../../modules/griller');
const controller = require('./users.controller');

module.exports = router;

router.param('userId', function(req, res, next, id) {
  req.griller = req.griller || new Griller(req);
  req.griller.attach('User', {_id: id})
    .then(next)
    .catch(next)
});

router.get('/', controller.getAll);

router.use('/:userId/repos', require('../repos'));

router.get('/:userId', controller.getOne);



