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

	board: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Board'
	},
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

mongoose.model('Card', cardSchema);