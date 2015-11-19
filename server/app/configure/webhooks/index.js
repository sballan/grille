'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Board = mongoose.model('Board')
var Card = mongoose.model('Card')

// This function might be useful to call the various parse function all in one shot.
function payloadParser(body) {

	var payload = {}
	payload.repo = parser.repo(body.repository)
	payload.sender = parser.user(body.sender)
	payload.issue = parser.issue(body.issue)
	payload.comment = parser.comment(body.comment)

	return payload
}



// These functions are called by the router.  When a webhook request comes in, it will have an event type listed in its header.  This event type will determine which of these functions is called.
var EventHandler = {
	commit_comment: function(body) {
	},
	create: function(body) {

	},
	delete: function(body) {

	},
	deployment: function(body) {

	},
	deployment_status: function(body) {

	},
	fork: function(body) {

	},
	gollum: function(body) {

	},
	issue_comment: function(body) {
		var payload = payloadParser(body)
		console.log("issue.github", payload.issue.githubID)

		Card.findOne({githubID: payload.issue.githubID})
		.then(function(card) {
			if(!card) console.error("No Issue Found!")

			var found = false
			card.comments.forEach(function(comment) {
				if(comment && comment.githubID === payload.comment.githubID) {
					comment = payload.comment
					found = true
				}
			})

			if(!found) card.comments.push(payload.comment)
				return card.save()
		})
		.then(function(card) {
			console.log("-----", card.comments)

		})


	},
	issues: function(body) {

	},
	member: function(body) {

	},
	membership: function(body) {

	},
	page_build: function(body) {

	},
	public: function(body) {

	},
	pull_request_review_comment: function(body) {

	},
	pull_request: function(body) {

	},
	push: function(body) {

	},
	repository: function(body) {

	},
	release: function(body) {

	},
	status: function(body) {

	},
	team_add: function(body) {

	},
	watch: function(body) {

	}

}

module.exports = EventHandler;


