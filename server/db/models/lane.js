'use strict';
var mongoose = require('mongoose');

var laneSchema = new mongoose.Schema({
	title: {type: String, required:true},
	active: Boolean
});

mongoose.model('Lane', laneSchema);