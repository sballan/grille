'use strict';
var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
	issueNumber: Number,
	title: String,
	body: String,
	state: String, //enum
	assignee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	milestone: String, //TODO check this out

	created_at: Date,
	updated_at: Date,
	closed_at: Date,
	due_on: Date,


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
	name: String,
	//branches: [branchSchema]
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	cards: [cardSchema]

});



mongoose.model('Board', schema);