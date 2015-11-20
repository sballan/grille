'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Board = mongoose.model('Board')
var Card = mongoose.model('Card')

// This function might be useful to call the various parse function all in one shot.
function payloadParser(body) {
	console.log("------Payload Function", body)

	var payload = {}
	payload.repo = parser.repo(body.repository) || null
	payload.sender = parser.user(body.sender) || null
	payload.issue = parser.issue(body.issue) || null
	payload.comment = parser.comment(body.comment) || null

	payload.action = body.action || null
	payload.label = body.label || null
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

		Card.findOne({githubID: payload.issue.githubID})
		.then(function(card) {
			if(!card) console.error("No Issue Found!")

			var found = false
			card.comments.forEach(function(comment) {
				if(comment && comment.githubID === payload.comment.githubID) {
					// FIXME Currently just replaces comment, fix this
					comment = payload.comment
					found = true
				}
			})

			if(!found) card.comments.push(payload.comment)
				return card.save()
		})
		.then(function(card) {
			console.info("-----issue_comment", card.comments)

		})


	},
	issues: function(body) {
		var payload = payloadParser(body)

		Card.findOne({githubID: payload.issue.githubID})
		.then(function(card) {
			if(!card) console.error("No Issue Found!")

			var found = false
			card.comments.forEach(function(comment) {
				if(comment && comment.githubID === payload.comment.githubID) {
					// FIXME Currently just replaces comment, fix this
					comment = payload.comment
					comment.labels.push(payload.label)
					found = true
				}
			})

			if(!found) card.comments.push(payload.comment)
				return card.save()
		})
		.then(function(card) {
			console.info("-----issues", card.comments)

		})
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


