'use strict';
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	body: String,
	githubID: Number,
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

	githubID: Number,
	url: String,
	labels_url: String,
	comments_url: String,
	events_url: String,
	html_url: String

})

var commitSchema = new mongoose.Schema({
	sha: String,
	author: String,
	email: String,
	date: Date
})

var branchSchema = new mongoose.Schema({
	name: String,
	commits: [commitSchema],

})

var boardSchema = new mongoose.Schema({
	name: String,  //The name of the repo
	githubID: Number,
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



mongoose.model('Board', boardSchema);