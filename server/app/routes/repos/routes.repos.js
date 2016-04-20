'use strict';
const chalk = require('chalk');
const router = require('express').Router();
const Griller = require('../../../modules/griller');
const controller = require('./repos.controller');

module.exports = router;

router.param('repoId', function(req, res, next, id) {
  req.griller = req.griller || new Griller(req);
  return req.griller.attach('Repo', {_id: id}, 'owner')
    .then(function(repo) {
      console.log(chalk.green(`Repo ${repo.name} was attached.`));
      next()
    })
    .catch(next)
});

router.get('/:repoId/fullView', controller.getOneFullView);
// Route for Issues
router.use('/:repoId/issues', require('../issues'));
// Route for Labels
router.use('/:repoId/labels', require('../labels'));


router.get('/:repoId', controller.getOne);

router.put('/:repoId', controller.updateOne);

router.get('/', controller.getAll);




