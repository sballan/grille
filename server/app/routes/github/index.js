'use strict';
var router = require('express').Router();

router.use('/repos/get/all', require('./routes.repos.getAll'));
router.use('/repos/get', require('./routes.repos.getOne'));
router.use('/repos/put', require('./routes.repos.putActive'));

module.exports = router;

