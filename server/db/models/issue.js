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
	hasComments: {type: Boolean, default: false},
	// repo: {type: mongoose.Schema.Types.ObjectId, ref: 'Repo'},
	state: String, //enum
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	priority: {
		type: Number, 
		default: -1
	},
	milestone: String, //TODO check this out

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

issueSchema.plugin(require('mongoose-deep-populate')(mongoose));

mongoose.model('Issue', issueSchema);
// mongoose.model('Comment', commentSchema);
