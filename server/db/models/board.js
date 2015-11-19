'use strict';
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	body: String,
	githubID: {
		type: Number,
		unique: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	created_at: Date,
	updated_at: Date
})

var cardSchema = new mongoose.Schema({
	issueNumber: Number,
	title: String,
	body: String,
	comments: [commentSchema],

	state: String, //enum
	assignee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	milestone: String, //TODO check this out
	priority: Number,  

	created_at: Date,
	updated_at: Date,
	closed_at: Date,
	due_on: Date,

	githubID: {
		type: Number,
		unique: true
	},
	url: String,
	labels_url: String,
	comments_url: String,
	events_url: String,
	html_url: String

})

var boardSchema = new mongoose.Schema({
	name: String,  //The name of the repo
	githubID: {
		type: Number,
		unique: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	cards: [cardSchema],
	html_url: String,
	url: String, //---- API ----
	collaborators_url: String,
	teams_url: String,
	hooks_url: String,


});

boardSchema.methods.commentUpdater = function(pComment, pCard) {
	var foundCard = null

	this.cards.forEach(function(card) {
		if(pCard.githubID === card.githubID) {
			foundCard = card
		}
	})

	if(!foundCard) {
		this.cards.push(pCard)
		this.cards.forEach(function(card) {

		})
	}

}

boardSchema.methods.cardUpdater = function(newCard) {
	this.cards.forEach(function(card) {
		if(card.githubID === newCard.githubID) {}
	})
}



mongoose.model('Board', boardSchema);