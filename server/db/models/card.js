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
	githubID: {
		type: Number,
		unique: true
	},
	storyPoints:Number,
	issueNumber: Number,
	title: String,
	body: String,
	comments: [commentSchema],
  board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
  lane: {type: mongoose.Schema.Types.ObjectId, ref: 'Lane'},

	state: String, //enum
	owner: {
		githubID: Number,
		url: String,
		username: String
	},
	assignee: String,
	priority: Number,  
	milestone: String, //TODO check this out
	labels: [mongoose.Schema.Types.Mixed],

	created_at: Date,
	updated_at: Date,
	closed_at: Date,
	due_on: Date,

	url: String,
	labels_url: String,
	comments_url: String,
	events_url: String,
	html_url: String,
	isPullRequest: {type: Boolean, default: false}
})

mongoose.model('Card', cardSchema);