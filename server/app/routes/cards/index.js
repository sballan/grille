var express = require("express");

var router = express.Router();
var GitHubApi = require('github')

router.use('/post', require('./cards.post'));

router.put("/",function(req,res,next){
	//update
	var github = req.user.githubAccess;
})

router.delete("/",function(req,res,next){
	var github = req.user.githubAccess;
})

module.exports = router;