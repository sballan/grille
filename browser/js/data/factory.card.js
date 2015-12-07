app.factory("CardFactory",function($http){
	function toData(res) {
		return res.data
	}
	return {
			addCard:function(card){
				card.board = {
					owner: card.board.owner,
					name: card.board.name,
					_id: card.board._id
				}
				console.log("From CardFactory, right before post:", card)
				return $http.post('/api/cards/post', card)
				.then(toData)
			},
			updatePriorityMany: function(cards) {
				var data = []

				cards.forEach(function(card) {
					data.push({
						_id: card._id,
						githubID: card.githubID,
						priority: card.priority
					})
				})

				return $http.put('/api/cards/put/priority/many', data)
				.then(toData)
			},
			updateLaneOne: function(card) {
				var data = {
					_id: card._id,
					githubID: card.githubID,
					lane: card.lane._id
				}
				return $http.put('/api/cards/put/lane/' + card.githubID, data)
			},
			updateLaneMany: function(cards) {
				var data = []

				cards.forEach(function(card) {
					data.push({
						_id: card._id,
						githubID: card.githubID,
						lane: card.lane
					})
				})

				return $http.put('/api/cards/put/lane/many', data)
				.then(toData)
			},


			updateCard:function(){

			},
			changePoints:function(card,points){
				// if(points="Clear"){
				//  points=null;
				// }

				return $http.put('/api/cards/put/storyPoints/'+card._id, {storyPoints:points})
				.then(function(response){
					console.log("response.data",response.data);
					return response.data;
				});
			},
	}
})