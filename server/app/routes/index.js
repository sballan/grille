'use strict';
var router = require('express').Router();
var Webhooks = require('../github-data/webhooks')
var io = require('../../io')

module.exports = router;

router.use('/board', require('./board'));
router.use('/cards', require('./cards'));
router.use('/repos', require('./repos'));
router.use('/comments', require('./comments'));

router.post('/webhooks', function(req, res, next) {
	console.log("webhook")
	//emit to a board via room
	var socket = io()
	//Can emit this after Webhooks exectues, or inside of Webhooks EventHandler
	socket.emit('update', {name: "backend data"})

	Webhooks[req.headers['x-github-event']](req.body)
	.then(function(){
		// console.log("WEBHOOK RESPONSE", response)
		res.send()
	})
	.then(null,next)

})


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
