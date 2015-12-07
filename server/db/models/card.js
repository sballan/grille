'use strict';
var mongoose = require('mongoose');
var Lane = mongoose.model('Lane')

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
	updated_at: Date,
	user: {}
})


var cardSchema = new mongoose.Schema({
	githubID: {
		type: Number,
		unique: true
	},
	//fibonnaci numbers used in agile/scrum
	storyPoints:{type:Number, enum:[null,1,2,3,5,8,13,20,40,100]},
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
	sprint:{type:mongoose.Schema.Types.ObjectId, ref:'Sprint'},
	url: String,
	labels_url: String,
	comments_url: String,
	events_url: String,
	html_url: String,
	isPullRequest: {type: Boolean, default: false}
})

cardSchema.post('init', function(doc) {
	if(!doc.lane) {
    Lane.findOne({
        board: doc.board._id,
        title: 'Backlog'
      })
      .then(function(lane) {
      	doc.lane = lane;
      	console.log("Making default lane for new Card:", doc)
      	return doc.save()
      })
	}
})

mongoose.model('Card', cardSchema);
// mongoose.model('Comment', commentSchema);