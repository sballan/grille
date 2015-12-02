'use strict';
var router = require('express').Router();

router.use('/lanes', require('./routes.lanes'));
router.use('/cards', require('./routes.cards'));

module.exports = router;

