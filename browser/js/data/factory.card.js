app.factory("CardFactory",function($http){
	function toData(res) {
		return res.data
	}
	return {
			addCard:function(card){
				// card.lane = card.lane._id;
				// card.board.cards = null
				return $http.post('/api/cards/post', card)
				.then(toData)
			},


			updateCard:function(){

			},


			deleteCard:function(){

			}
	}
})