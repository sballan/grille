'use strict';
const chalk = require('chalk');
const router = require('express').Router();
const Griller = require('../../../modules/griller');
const controller = require('./users.controller');


module.exports = router;

router.param('userId', function(req, res, next, id) {
  req.griller = req.griller || new Griller(req);
  return req.griller.attach('User', {_id: id})
    .then(user=>{
      console.log("User", user)
      console.log(chalk.green(`User ${user.username} was attached.`));
      next()
    })
    .catch(next)
});

router.use('/:userId/repos', require('../repos'));
// FIXME I think this line is unnecessary, check docs
//router.use('/:userId/repos/:repoId', require('../repos'));

router.get('/:userId', controller.getOne);

router.get('/', controller.getAll);


