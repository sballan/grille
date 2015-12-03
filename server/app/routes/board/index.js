'use strict';
var router = require('express').Router();

router.use('/lanes', require('./routes.lanes'));

module.exports = router;

