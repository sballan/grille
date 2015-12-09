var express = require("express");

var router = express.Router();

router.use('/post', require('./cards.post'));
router.use('/put', require('./cards.put'));

// update with sprint ..dok4 and then find all cards with the board id, then find all with the sprint id
//then link this up with card factory for the home choosesprint, then visuals



module.exports = router;