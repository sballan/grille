// With more time will expand to cover larger project milestones,
// however limiting scope to sprints for now.
var express = require("express");
var router = express.Router();
var Sprint = require('mongoose').model('Sprint');

router.post('/',function(req,res, next){
	//create
	Sprint.create(req.body)
	.then(function(createdSprint){
		res.send(createdSprint);
	})
})


router.get('/:id',function(req,res, next){

})

router.get('/all/:boardId',function(req,res, next){
	Sprint.find({board:req.params.boardId})
	.then(function(allFound){
		res.send(allFound);
	})

})


router.put('/:id',function(req,res, next){

})

router.delete('/:id',function(req,res, next){

})



module.exports = router;