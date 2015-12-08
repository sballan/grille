// With more time will expand to cover larger project milestones,
// however limiting scope to sprints for now.
var express = require("express");
var router = express.Router();
var Sprint = require('mongoose').model('Sprint');

router.post('/',function(req,res, next){
	//create
	console.log("before creating sprint", req.body)
	Sprint.create(req.body)
	.then(function(createdSprint){
		console.log("after creating", createdSprint)
		res.send(createdSprint);
	})
})


router.get('/:id',function(req,res, next){

})

router.get('/all/:boardId',function(req,res, next){
	console.log("got to get all sprints")
	//completed:false
	Sprint.find({board:req.params.boardId})
	.then(function(allFound){
		console.log("ALLLL FOUND",allFound);
		res.send(allFound);
	})
	.then(null,function(err){
		res.send(null)
	})
})


router.put('/:id',function(req,res, next){

})

router.delete('/:id',function(req,res, next){

})



module.exports = router;