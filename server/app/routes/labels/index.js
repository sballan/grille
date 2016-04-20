'use strict';
var router = require('express').Router();

router.use('/', require('./routes.labels'));

module.exports = router;
