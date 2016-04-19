'use strict';
const router = require('express').Router();
const Griller = require('../../../modules/griller');
const controller = require('./repos.controller');

module.exports = router;

router.param('repoId', function(req, res, next, id) {
  req.griller = req.griller || new Griller(req);
  return req.griller.attach('Repo', {_id: id}, 'owner')
    .then(function(repo) {
      console.log(`Repo ${repo.name} was attached.`);
      next()
    })
    .catch(next)
});

router.get('/:repoId/fullView', controller.getOneFullView);
// Route for Issues
router.use('/:repoId/issues', require('../issues'));

router.use('/:repoId/labels', function(req, res, next) {
  console.log("gonna find some labels");
  req.griller = req.griller || new Griller(req);
  req.griller._getRepoLabels = true;
  next()
}, require('../labels'));


router.get('/:repoId', controller.getOne);

router.put('/:repoId', controller.updateOne);

router.get('/', controller.getAll);




