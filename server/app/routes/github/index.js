'use strict';
var router = require('express').Router();

router.use('/repos', require('./routes.repos'));

module.exports = router;

