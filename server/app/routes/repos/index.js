'use strict';
var router = require('express').Router();

//OP: don't need to say "get", "put"
router.use('/get/all', require('./routes.repos.getAll'));
router.use('/get', require('./routes.repos.getOne'));
router.use('/put', require('./routes.repos.putActive'));

module.exports = router;
