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
	}

});



mongoose.model('Feature', schema);