app.factory("CardFactory", ['$http', function($http){
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
				return $http.post('/api/cards', card)
				.then(toData)
			},
			updatePriorityMany: function(cards) {
				var data = []

				cards.forEach(function(card) {
					data.push({
						_id: card._id,
						githubId: card.githubId,
						priority: card.priority
					})
				})

				return $http.put('/api/cards/priority/many', data)
				.then(toData)
			},
			updateLaneOne: function(card) {
				var data = {
					_id: card._id,
					githubId: card.githubId,
					lane: card.lane._id
				}
				return $http.put('/api/cards/lane/' + card.githubId, data)
			},
			updateLaneMany: function(cards) {
				var data = []

				cards.forEach(function(card) {
					data.push({
						_id: card._id,
						githubId: card.githubId,
						lane: card.lane
					})
				})

				return $http.put('/api/cards/lane/many', data)
				.then(toData)
			},


			updateCardTitle:function(card){
				//the card title has been updated by this point, in ng-model
				return $http.put('/api/cards/title/' + card.githubId, card)
				.then(function(response){
					return response.data
				})
			},
			changePoints:function(card,points){
				if(points=="Clear"){
				 points=null;
				}
				return $http.put('/api/cards/storyPoints/'+card._id, {storyPoints:points})
				.then(function(response){
					return response.data;
				});
			},
			chooseSprint:function(card,sprint){
				return $http.put('/api/cards/sprint/'+card._id+"/"+sprint._id)
				.then(toData);
			}
	}
}])
