var router = require('express').Router();
var Card = require('mongoose').model('Card');
module.exports = router;

router.post('/post/:cardID', function(req,res,next){
	//1 tell Github that we added a comment
	//2 persist comment to our DB

	Card.findOne({ githubID: req.params.cardID})
	.then(function(card){

		return card
	})
	// .then(function())
})