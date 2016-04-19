'use strict';
var router = require('express').Router();

router.use('/', require('./routes.labels.js'));

module.exports = router;
