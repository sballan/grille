'use strict';
var router = require('express').Router();
//var io = require('../../io')

module.exports = router;

//router.use('/repo', require('./repo'));
router.use('/issues', require('./issues'));
router.use('/repos', require('./repos'));
router.use('/users', require('./users'));
//router.use('/comments', require('./comments'));
//router.use('/milestones', require('./milestones'));


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
