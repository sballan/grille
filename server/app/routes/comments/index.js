'use strict';
var router = require('express').Router();

router.use('/', require('./comments.js'));

module.exports = router;
