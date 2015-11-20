'use strict';
var router = require('express').Router();
var Webhooks = require('../github-data/webhooks')
module.exports = router;

router.use('/members', require('./members'));

router.post('/webhooks', function(req, res, next) {
	Webhooks[req.headers['x-github-event']](req.body)
	res.send()

})


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
