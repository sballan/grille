'use strict';
var router = require('express').Router();
module.exports = router;

router.post('/', function(req, res, next) {
	console.log(req.headers)
	EventHandler[req.headers.x-github-event](req.body)
	res.send()

})

router.get('/', function(req, res, next) {
	res.send("It worked!")
	console.log("It worked!")
})

var EventHandler = {
	commit_comment: function() {

	},
	create: function() {

	},
	delete: function() {

	},
	deployment: function() {

	},
	deployment_status: function() {

	},
	fork: function() {

	},
	gollum: function() {

	},
	issue_comment: function() {

	},
	issues: function() {

	},
	member: function() {

	},
	membership: function() {

	},
	page_build: function() {

	},
	public: function() {

	},
	pull_request_review_comment: function() {

	},
	pull_request: function() {

	},
	push: function() {

	},
	repository: function() {

	},
	release: function() {

	},
	status: function() {

	},
	team_add: function() {

	},
	watch: function() {

	}

}


