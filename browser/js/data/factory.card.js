app.factory("CardFactory",function($http){
	function toData(res) {
		return res.data
	}
	return {
			addCard:function(card){
				return $http.post('/api/cards/post', card)
				.then(toData)
			},


			updateCard:function(){

			},


			deleteCard:function(){

			}
	}
})