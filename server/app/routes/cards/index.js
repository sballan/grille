var express = require("express");

var router = express.Router();
var GitHubApi = require('github')


router.post("/",function(req,res,next){
	var github = req.user.githubAccess;
})

module.exports = router;