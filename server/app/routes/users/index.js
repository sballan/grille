'use strict';
var router = require('express').Router();

//OP: don't need to say "get", "put"
router.use('/', require('./routes.users'));


module.exports = router;
