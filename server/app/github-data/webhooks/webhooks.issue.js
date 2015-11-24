'use strict';
var parser = require('../parsers')
var mongoose = require('mongoose')
var Board = mongoose.model('Board')
var Card = mongoose.model('Card')
var Board = mongoose.model('Board')
var User = mongoose.model('User')
var io = require('../../../io')

module.exports = {
	issues: function(body) {
		var payload = parser.payload(body)
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
				return card.save()
			})

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
				return card.save()
			})

		}

		this.labeled = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard) {
				// Replaces a card's labels with the ones from the payload
				theCard.labels = payload.issue.labels
				return theCard.save()
			})

		}

		this.unlabeled = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard) {
				// Replaces a card's labels with the ones from the payload
				theCard.labels = payload.issue.labels
				return theCard.save()
			})

		}

		this.opened = function(payload) {
			Card.create(payload.issue)
		}

		this.closed = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard){
					theCard.status = 'closed'
					return theCard.save()
			})
		}

		this.reopened = function(payload) {
			Card.findOne({githubID: payload.issue.githubID})
			.then(function(theCard){
					theCard.status = 'opened'
					return theCard.save()
			})
		}

		// This is where we actually call the function chosen by the action. It needs to appear after the function declarations
		this[action](payload)

	}
}