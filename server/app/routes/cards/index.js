var express = require("express");

var router = express.Router();

// router.use('/post', require('./cards.post'));
router.use('/', require('./cards'));
router.use('/lane', require('./cards.lane'));


// update with sprint ..dok4 and then find all cards with the repo id, then find all with the sprint id
//then link this up with card factory for the home choosesprint, then visuals



module.exports = router;
