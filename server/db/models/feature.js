'use strict';
var mongoose = require('mongoose');

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
		ref: 'Board'
	},

	created_at: {
		type: Date,
		default: new Date()
	},
	updated_at: Date

});



mongoose.model('Feature', schema);