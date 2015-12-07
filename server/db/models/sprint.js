'use strict';
var mongoose = require('mongoose');

var sprintSchema = new mongoose.Schema({
	title:String,
	description: String,
	startDate: Date,
	endDate: Date,
	board: {type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
	assignees:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
})


sprintSchema.virtual('days').get(function (){
	//milliseconds in a day, get days between to calculate for D3
	var dayInMilliseconds = 60*60*24*1000;
	return Math.floor(((this.endDate - this.startDate) / dayInMilliseconds));
})



mongoose.model('Sprint', sprintSchema);