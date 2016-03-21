'use strict';
var mongoose = require('mongoose');

//OP: plan on using this?

var featureSchema = new mongoose.Schema({
	name: String,
	//branches: [branchSchema]
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	cards: [cardSchema],
	board: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Repo'
	},

	created_at: {
		type: Date,
		default: new Date()
	},
	updated_at: Date

});



mongoose.model('Feature', schema);