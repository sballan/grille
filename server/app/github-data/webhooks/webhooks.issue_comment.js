'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Board = mongoose.model('Board')
var Card = mongoose.model('Card')
var Board = mongoose.model('Board')
var User = mongoose.model('User')
var io = require('../../../io')

module.exports = {
	issue_comment: function(body) {
		var payload = parser.payload(body)
		if(payload.action !== 'created') console.error("Action for issue_comment should be 'created'")

		Card.findOne({githubId: payload.issue.githubId})
		.then(function(card) {
			if(!card) console.error("Cannot add comment to a card that does not exist")

			card.comments.push(payload.comment)
			return card.save()
		})

	}

}
