'use strict';
var mongoose = require('mongoose');
//var Lane = mongoose.model('Lane')


var issueSchema = new mongoose.Schema({
	githubId: {
		type: Number,
		unique: true
	},
	//fibonnaci numbers used in agile/scrum
	storyPoints:{type:Number, enum:[null,1,2,3,5,8,13,20,40,100]},
	issueNumber: Number,
	title: String,
	body: String,
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	repo: {type: mongoose.Schema.Types.ObjectId, ref: 'Repo'},
	state: String, //enum
	owner: {
		githubId: Number,
		url: String,
		username: String
	},
	assignee: String,
	priority: {
		type: Number, 
		default: -1
	},
	milestone: String, //TODO check this out
	labels: [mongoose.Schema.Types.Mixed],

	created_at: Date,
	updated_at: Date,
	closed_at: Date,
	due_on: Date,
	sprint: {
		type: mongoose.Schema.Types.ObjectId,
		ref:'Sprint'
	},
	url: String,
	labels_url: String,
	comments_url: String,
	events_url: String,
	html_url: String,
	isPullRequest: {type: Boolean, default: false}
})


mongoose.model('Issue', issueSchema);
// mongoose.model('Comment', commentSchema);
