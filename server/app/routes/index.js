'use strict';
var router = require('express').Router();
var Webhooks = require('../github-data/webhooks')
var io = require('../../io')

module.exports = router;

router.use('/members', require('./members'));

router.post('/webhooks', function(req, res, next) {
	var socket = io()
	//Can emit this after Webhooks exectues, or inside of Webhooks EventHandler
	socket.emit('update', {name: "UPDATED sample DATA"})
	
	Webhooks[req.headers['x-github-event']](req.body)
	res.send()

})


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
