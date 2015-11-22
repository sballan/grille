'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Board = mongoose.model('Board')
var Card = mongoose.model('Card')
var Board = mongoose.model('Board')
var User = mongoose.model('User')

// This function might be useful to call the various parse function all in one shot.
function payloadParser(body) {
	//console.log("------Payload Function", body)

	var payload = {}
	payload.repo = parser.repo(body.repository) || null
	payload.sender = parser.user(body.sender) || null
	payload.assignee = parser.user(body.assignee) || null
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
		if(payload.action !== 'created') console.error("Action for issue_comment should be 'created'")

		Card.findOne({githubID: payload.issue.githubID})
		.then(function(card) {
			if(!card) console.error("Cannot add comment to a card that does not exist")

			card.comments.push(payload.comment)
		})
		.then(null, next)


	},
	issues: function(body) {
		var payload = payloadParser(body)
		var action = payload.action


		this.assigned = function(payload) {
			var card;
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard) {
				card = theCard;
				return User.findOne({githubID: payload.assignee.githubID})
			})
			.then(function(user) {
				card.assignee = user._id
				card.save()
			})
			.then(null, next)
		}

		this.unassigned = function(payload) {
			var card;
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard) {
				card = theCard;
				return User.findOne({githubID: payload.assignee.githubID})
			})
			.then(function(user) {
				card.assignee = null;
				card.save()
			})
			.then(null, next)
		}

		this.labeled = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard) {
				console.log('-----Payload', payload.issue.labels)
				console.log('-----Card', theCard)
				console.log('-----Card labels', theCard.labels)
				// Replaces a card's labels with the ones from the payload
				theCard.labels = payload.issue.labels
				theCard.save()
			})
			.then(null, next)
		}

		this.unlabeled = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard) {
				// Replaces a card's labels with the ones from the payload
				theCard.labels = payload.issue.labels
				theCard.save()
			})
			.then(null, next)
		}

		this.opened = function(payload) {
			Card.create(payload.issue)
		}

		this.closed = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard){
					theCard.status = 'closed'
			})
		}

		this.reopened = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard){
					theCard.status = 'opened'
			})
		}

		// This is where we actually call the function chosen by the action. It needs to appear after the function declarations
		this[action](payload)

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

