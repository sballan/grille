'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Repo = mongoose.model('Repo')
var Issue = mongoose.model('Issue')
var Repo = mongoose.model('Repo')
var User = mongoose.model('User')
var io = require('../../../io')

module.exports = {
	issues: function(body) {
		var payload = parser.payload(body)
		var action = payload.action


		this.assigned = function(payload) {
			var card;
			Issue.findOne({githubId: payload.issue.githubId})
			.then(function(theCard) {
				card = theCard;
				return User.findOne({githubId: payload.assignee.githubId})
			})
			.then(function(user) {
				card.assignee = user._id
				return card.save()
			})

		}

		this.unassigned = function(payload) {
			var card;
			Issue.findOne({githubId: payload.issue.githubId})
			.then(function(theCard) {
				card = theCard;
				return User.findOne({githubId: payload.assignee.githubId})
			})
			.then(function(user) {
				card.assignee = null;
				return card.save()
			})

		}

		this.labeled = function(payload) {
			Issue.findOne({githubId: payload.issue.githubId})
			.then(function(theCard) {
				// Replaces a card's labels with the ones from the payload
				theCard.labels = payload.issue.labels
				return theCard.save()
			})

		}

		this.unlabeled = function(payload) {
			Issue.findOne({githubId: payload.issue.githubId})
			.then(function(theCard) {
				// Replaces a card's labels with the ones from the payload
				theCard.labels = payload.issue.labels
				return theCard.save()
			})

		}

		this.opened = function(payload) {
			Issue.create(payload.issue)
		}

		this.closed = function(payload) {
			Issue.findOne({githubId: payload.issue.githubId})
			.then(function(theCard){
					theCard.status = 'closed'
					return theCard.save()
			})
		}

		this.reopened = function(payload) {
			Issue.findOne({githubId: payload.issue.githubId})
			.then(function(theCard){
					theCard.status = 'opened'
					return theCard.save()
			})
		}

		// This is where we actually call the function chosen by the action. It needs to appear after the function declarations
		this[action](payload)

	}
}
