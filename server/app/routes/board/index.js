'use strict';
var router = require('express').Router();

router.use('/lanes', require('./routes.lanes'));

router.use('/comments', require('./routes.comments'));

module.exports = router;

