var express = require("express");

var router = express.Router();
var GitHubApi = require('github')


router.post("/",function(req,res,next){
	var github = new GitHubApi({
		debug: true,
		version: "3.0.0"
	} );

	github.authenticate({
		type: "oauth",
		token: req.user.accessToken
	});
	req.body.tex
})

module.exports = router;