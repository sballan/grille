'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Board = mongoose.model('Board')
var Card = mongoose.model('Card')
var Board = mongoose.model('Board')
var User = mongoose.model('User')
var io = require('../../../io')
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
	payload.member = parser.user(body.member) || null
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
		var board;
		var payload = payloadParser(body)

		if(payload.action !== 'added') console.error("Action for membership should be 'added'")

		// Find the repo
		Board.findOne({githubID: payload.repo.githubID})
		.populate('collaborators')
		.then(function(theBoard) {
			board = theBoard;
			// Find the member
			return User.findOne({githubID: payload.member})
		})
		.then(function(theUser) {
			if(theUser) {
				// If the member is in our database, find out if it's already added to the collaborators list
				board.collaborators.forEach(function(collaborator) {
					// If it's already there, just return
					if(theUser.githubID === collaborator.githubID) {
						return;
					} else {
						// If it's not, add the member to the list
						board.collaborators.push(theUser)
					}
				})
			} else {
				// If the member isn't in the database, create it
				return User.create(payload.member)
			}
		})
		// Add member to list
		.then(function(theUser) {
			board.collaborators.push(theUser)
		})
		.then(null, next)

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
	repository: function(payload) {

		this.created = function(payload){
			var repo = payload.repository;
			//payload.epository has a name and owner on it, and a bunch of other extra stuff that will be ignored by mongoose
			
			//Attempt 1.
			//this would be nice...but board.owner is a reference-ID to a user, not an actual name-object like it is in payload.repository.owner
			//Board.create(payload.repository)

			//Attempt 2.
			var theUser = user;
			User.find({ githubID: payload.owner.id})
			.then(function(user){
				theUser = user;
			})

			Board.create(
				{ 
					name: repo.name,
					githubID: repo.id,
					owner: theUser,

					html_url: payload.html_url,
					url: payload.url,
					collaborators_url: payload.collaborators_url,
					teams_url: payload.teams_url,
					hooks_url: payload.hooks_url
				}
			)

			//Attempt 3. - IDEAL
			//have a pre-save hook that sets the Owner to the one in payload.owner.id, so that card.owner stays as a reference
			//and the rest of the fields will get their values from payload.repository
			//Board.create(payload.repository);

		}
		this.created(payload);

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


