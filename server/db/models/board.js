'use strict';
var mongoose = require('mongoose');

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
	collaborators: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	lanes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Lane'
	}],
	html_url: String,
	url: String, //---- API ----
	collaborators_url: String,
	teams_url: String,
	hooks_url: String,

});



mongoose.model('Board', boardSchema);