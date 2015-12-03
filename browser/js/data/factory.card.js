app.factory("CardFactory",function($http){
	function toData(res) {
		return res.data
	}
	return {
			addCard:function(card){
				// card.lane = card.lane._id;
				console.log('CardFactory', card)
				return $http.post('/api/cards/post', card)
				.then(toData)
			},
			updatePriorityCards: function(cards) {
				return $http.put('/api/cards/put/priority/many', cards)
				.then(toData)
			},


			updateCard:function(){

			},


			deleteCard:function(){

			}
	}
})