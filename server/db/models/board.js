'use strict';
var mongoose = require('mongoose');

var laneSchema = new mongoose.Schema({
	name: String,
	color: String,
	cards: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Card'
	}]
})

mongoose.model('Lane', laneSchema);

var boardSchema = new mongoose.Schema({
	name: String,  //The name of the repo
	githubID: {
		type: Number,
		unique: true
	},
	isActive: {
		type: Boolean,
		default: false
	},
	owner: {
		githubID: Number,
		url: String,
		username: String
	},
	collaborators: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	lanes: [laneSchema],
	html_url: String,
	url: String, //---- API ----
	collaborators_url: String,
	teams_url: String,
	hooks_url: String
});

boardSchema.pre('init', function() {

})


mongoose.model('Board', boardSchema);