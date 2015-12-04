var express = require("express");

var router = express.Router();

router.use('/post', require('./cards.post'));
router.use('/put', require('./cards.put'));


module.exports = router;