'use strict';
var router = require('express').Router();

router.use('/', require('./routes.repos'));

module.exports = router;
