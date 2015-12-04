'use strict';
var router = require('express').Router();

router.use('/', require('./comments.post.js'));

module.exports = router;

