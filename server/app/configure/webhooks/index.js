'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Board = mongoose.model('Board')

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
		Board.find({githubID: payload.repo.githubID})
		.then(function(board) {
			if(!board.length) {
				return Board.create(payload.repo)
			}

			var findCard = board.cards.filter(function(card) {
				return card.githubID == payload.issue.githubID
			})



				var comment = findCard[0].comments.filter(function(comment) {
					return comment.githubID === payload.comment.githubID
				})
			} else {
				board.cards.push(payload.issue)
			}


		})

		console.log("-----", comment)


		return comment
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


