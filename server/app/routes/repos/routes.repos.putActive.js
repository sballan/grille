'use strict';
var router = require('express').Router();
var Promise = require('bluebird')
var Griller = require('../../../middleware/github-griller');

var Repo = require('mongoose').model('Repo');

module.exports = router;

///* For Testing Purposes

// router.put('/:repoID/active', function(req, res, next) {
//   return Griller(req).getOneRepo(req.params.repoID)
//   .then(function() {
//     console.log("here is the req", Object.keys(req))
//   })
//
// });

//*/


router.put('/:repoID/active', function(req, res, next) {
	var github = req.user.githubAccess;

	Repo.findOneAndUpdate({ githubId: req.params.repoID}, { isActive: true}, {new : true})
	.then(function(repo){
		res.send(repo)
	})

})
