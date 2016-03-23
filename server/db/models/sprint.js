'use strict';
var mongoose = require('mongoose');

var sprintSchema = new mongoose.Schema({
	title:String,
	description: String,
	startDate: Date,
	endDate: Date,
	repo: {type: mongoose.Schema.Types.ObjectId, ref: 'Repo'},
	assignees:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
	completed: {type:Boolean, default:false}
})


sprintSchema.virtual('days').get(function (){
	//milliseconds in a day, get days between to calculate for D3
	var dayInMilliseconds = 60*60*24*1000;
	return Math.floor(((this.endDate - this.startDate) / dayInMilliseconds));
})



mongoose.model('Sprint', sprintSchema);
