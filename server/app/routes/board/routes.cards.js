var router = require('express').Router();
var Card = require('mongoose').model('Card');
module.exports = router;

router.post('/post/:cardID', function(req,res,next){
	//1 tell Github that we added a comment
	//2 persist comment to our DB
	console.log("~~~ROUTER HIT, cardID is:", req.params.cardID)
	Card.findOne({ githubID: req.params.cardID})
	.then(function(card){
		console.log("~~~ROUTER, found card is:", card)
		return card
	})
	// .then(function())
})