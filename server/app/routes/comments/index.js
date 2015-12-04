'use strict';
var router = require('express').Router();

router.use('/', require('./routes.comments'));

module.exports = router;

