'use strict';
// const Griller = require('../../../modules/griller');
const router = require('express').Router();
const controller = require('./labels.controller');

module.exports = router;

router.get('/', controller.getAll);


